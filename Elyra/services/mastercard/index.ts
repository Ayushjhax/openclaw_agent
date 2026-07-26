import { recordMastercardAuditEvent } from "./audit";
import { getMastercardConfig } from "./config";
import { mastercardRepository } from "./repository";
import type {
  MastercardAccessToken,
  MastercardConnectUrl,
  MastercardCustomer,
  MastercardRemoteAccount,
  MastercardRemoteTransaction,
} from "./types";

type CreateCustomerInput = {
  appUserId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
};

type ConnectUrlInput = CreateCustomerInput & {
  redirectUri?: string;
};

type TransactionRange = {
  fromDate?: Date;
  toDate?: Date;
};

let cachedToken: MastercardAccessToken | null = null;

function tokenIsFresh(token: MastercardAccessToken | null) {
  return Boolean(token && token.expiresAt - Date.now() > 60_000);
}

function headers(token?: string) {
  const config = getMastercardConfig();
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Finicity-App-Key": config.appKey,
    ...(token ? { "Finicity-App-Token": token } : {}),
  };
}

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) {
    return {} as T;
  }
  return JSON.parse(text) as T;
}

async function mastercardFetch<T>(
  path: string,
  init: RequestInit,
  token?: string,
) {
  const config = getMastercardConfig();
  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...headers(token),
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Mastercard Open Finance request failed (${response.status}) ${path}: ${body.slice(0, 300)}`,
    );
  }

  return readJson<T>(response);
}

function finicityDate(date: Date) {
  return Math.floor(date.getTime() / 1000);
}

function customerUsername(appUserId: string) {
  const normalized = appUserId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
  return `elyra_${normalized}_${process.env.NODE_ENV ?? "dev"}`;
}

function extractCustomerId(payload: unknown) {
  const data = payload as { id?: unknown; customerId?: unknown; customer?: { id?: unknown } };
  const id = data.id ?? data.customerId ?? data.customer?.id;
  if (!id) {
    throw new Error("Mastercard customer response did not include an id.");
  }
  return String(id);
}

function extractConnectUrl(payload: unknown) {
  const data = payload as {
    link?: unknown;
    url?: unknown;
    connectUrl?: unknown;
    expiresAt?: unknown;
  };
  const link = data.link ?? data.url ?? data.connectUrl;
  if (!link || typeof link !== "string") {
    throw new Error("Mastercard Connect response did not include a URL.");
  }
  return {
    connectUrl: link,
    expiresAt: typeof data.expiresAt === "string" ? data.expiresAt : undefined,
  };
}

function extractAccounts(payload: unknown): MastercardRemoteAccount[] {
  const data = payload as {
    accounts?: MastercardRemoteAccount[];
    account?: MastercardRemoteAccount[];
  };
  return data.accounts ?? data.account ?? [];
}

function extractTransactions(payload: unknown): MastercardRemoteTransaction[] {
  const data = payload as { transactions?: MastercardRemoteTransaction[] };
  return data.transactions ?? [];
}

export async function createAccessToken(): Promise<MastercardAccessToken> {
  if (tokenIsFresh(cachedToken)) {
    return cachedToken as MastercardAccessToken;
  }

  const config = getMastercardConfig();
  const payload = await mastercardFetch<{
    token?: string;
    accessToken?: string;
    expiresIn?: number;
  }>("/aggregation/v2/partners/authentication", {
    method: "POST",
    body: JSON.stringify({
      partnerId: config.partnerId,
      partnerSecret: config.partnerSecret,
    }),
  });

  const token = payload.token ?? payload.accessToken;
  if (!token) {
    throw new Error("Mastercard authentication response did not include a token.");
  }

  cachedToken = {
    token,
    expiresAt: Date.now() + (payload.expiresIn ?? 90 * 60) * 1000,
  };

  await recordMastercardAuditEvent({
    action: "mastercard.token.create",
    status: "success",
    detail: "Created partner access token.",
  });

  return cachedToken;
}

export async function createCustomer(
  input: CreateCustomerInput,
): Promise<MastercardCustomer> {
  const existing = await mastercardRepository.getCustomerByUserId(input.appUserId);
  if (existing) {
    return existing;
  }

  const config = getMastercardConfig();
  const access = await createAccessToken();
  const username = input.username ?? customerUsername(input.appUserId);
  const path =
    config.customerType === "active"
      ? "/aggregation/v2/customers/active"
      : "/aggregation/v2/customers/testing";
  const payload = await mastercardFetch<unknown>(
    path,
    {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName: input.firstName ?? "Elyra",
        lastName: input.lastName ?? "User",
      }),
    },
    access.token,
  );

  const customerId = extractCustomerId(payload);
  const customer = await mastercardRepository.saveCustomer({
    appUserId: input.appUserId,
    customerId,
    username,
  });

  await recordMastercardAuditEvent({
    appUserId: input.appUserId,
    action: "mastercard.customer.create",
    status: "success",
    metadata: { customerType: config.customerType },
  });

  return customer;
}

export async function generateConnectUrl(
  input: ConnectUrlInput,
): Promise<MastercardConnectUrl> {
  const config = getMastercardConfig();
  const customer = await createCustomer(input);
  const access = await createAccessToken();
  const redirectUri =
    input.redirectUri ??
    config.redirectUri ??
    `${process.env.NEXT_PUBLIC_REDIRECT_URI ?? "http://localhost:3000"}/api/mastercard/callback`;

  const payload = await mastercardFetch<unknown>(
    "/connect/v2/generate",
    {
      method: "POST",
      body: JSON.stringify({
        partnerId: config.partnerId,
        customerId: customer.customerId,
        redirectUri,
        webhook: config.webhookUrl,
        webhookContentType: config.webhookUrl ? "application/json" : undefined,
        experience: config.connectExperience,
        type: "aggregation",
      }),
    },
    access.token,
  );

  const connect = extractConnectUrl(payload);
  await recordMastercardAuditEvent({
    appUserId: input.appUserId,
    action: "mastercard.connect_url.generate",
    status: "success",
  });

  return {
    customerId: customer.customerId,
    ...connect,
  };
}

export async function refreshAccounts(appUserId: string) {
  const customer = await mastercardRepository.getCustomerByUserId(appUserId);
  if (!customer) {
    return [];
  }

  const access = await createAccessToken();
  const payload = await mastercardFetch<unknown>(
    `/aggregation/v1/customers/${customer.customerId}/accounts`,
    { method: "POST" },
    access.token,
  );
  const accounts = extractAccounts(payload);
  await mastercardRepository.upsertAccounts(appUserId, customer.customerId, accounts);

  await recordMastercardAuditEvent({
    appUserId,
    action: "mastercard.accounts.refresh",
    status: "success",
    metadata: { accountCount: accounts.length },
  });

  return mastercardRepository.listAccounts(appUserId);
}

export async function getAccounts(appUserId: string) {
  const customer = await mastercardRepository.getCustomerByUserId(appUserId);
  if (!customer) {
    return [];
  }

  try {
    const access = await createAccessToken();
    const payload = await mastercardFetch<unknown>(
      `/aggregation/v1/customers/${customer.customerId}/accounts`,
      { method: "GET" },
      access.token,
    );
    const accounts = extractAccounts(payload);
    await mastercardRepository.upsertAccounts(appUserId, customer.customerId, accounts);
  } catch (error) {
    await recordMastercardAuditEvent({
      appUserId,
      action: "mastercard.accounts.fetch",
      status: "failure",
      detail: error instanceof Error ? error.message : "Unknown account fetch error",
    });
  }

  return mastercardRepository.listAccounts(appUserId);
}

export async function getTransactions(
  appUserId: string,
  range: TransactionRange = {},
) {
  const customer = await mastercardRepository.getCustomerByUserId(appUserId);
  const toDate = range.toDate ?? new Date();
  const fromDate =
    range.fromDate ?? new Date(toDate.getTime() - 90 * 24 * 60 * 60 * 1000);

  if (!customer) {
    return [];
  }

  try {
    const access = await createAccessToken();
    const params = new URLSearchParams({
      fromDate: String(finicityDate(fromDate)),
      toDate: String(finicityDate(toDate)),
    });
    const payload = await mastercardFetch<unknown>(
      `/aggregation/v3/customers/${customer.customerId}/transactions?${params.toString()}`,
      { method: "GET" },
      access.token,
    );
    const transactions = extractTransactions(payload);
    await mastercardRepository.upsertTransactions(appUserId, transactions);
  } catch (error) {
    await recordMastercardAuditEvent({
      appUserId,
      action: "mastercard.transactions.fetch",
      status: "failure",
      detail:
        error instanceof Error ? error.message : "Unknown transaction fetch error",
    });
  }

  return mastercardRepository.listTransactions(appUserId, { from: fromDate, to: toDate });
}

export async function getBalances(appUserId: string) {
  return mastercardRepository.listBalances(appUserId);
}

