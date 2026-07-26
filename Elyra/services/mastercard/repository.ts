import fs from "node:fs/promises";
import path from "node:path";
import {
  decryptIdentifier,
  encryptIdentifier,
  hashIdentifier,
} from "./encryption";
import type {
  AccountBalance,
  LinkedAccount,
  MastercardCustomer,
  MastercardRemoteAccount,
  MastercardRemoteTransaction,
  StoredTransaction,
} from "./types";

type StoredCustomerRecord = {
  id: string;
  appUserId: string;
  customerIdEncrypted: string;
  customerKey: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

type StoredLinkedAccountRecord = LinkedAccount & {
  accountIdEncrypted: string;
  institutionIdEncrypted?: string;
};

type AuditLogRecord = {
  id: string;
  createdAt: string;
  appUserId?: string;
  action: string;
  status: "success" | "failure" | "info";
  detail?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

type MastercardStore = {
  customers: StoredCustomerRecord[];
  linkedAccounts: StoredLinkedAccountRecord[];
  balances: AccountBalance[];
  transactions: StoredTransaction[];
  auditLogs: AuditLogRecord[];
};

const EMPTY_STORE: MastercardStore = {
  customers: [],
  linkedAccounts: [],
  balances: [],
  transactions: [],
  auditLogs: [],
};

function dataFilePath() {
  return (
    process.env.MASTERCARD_DATA_FILE ??
    path.join(process.cwd(), ".data", "mastercard-open-finance.json")
  );
}

async function readStore(): Promise<MastercardStore> {
  try {
    const raw = await fs.readFile(dataFilePath(), "utf8");
    return { ...EMPTY_STORE, ...(JSON.parse(raw) as Partial<MastercardStore>) };
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === "ENOENT") {
      return { ...EMPTY_STORE };
    }
    throw error;
  }
}

async function writeStore(store: MastercardStore) {
  const target = dataFilePath();
  await fs.mkdir(path.dirname(target), { recursive: true });
  const temp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(temp, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(temp, target);
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeId(value: unknown) {
  if (value === undefined || value === null) {
    return "";
  }
  return String(value);
}

function getRemoteAccountId(account: MastercardRemoteAccount) {
  return normalizeId(account.id ?? account.accountId);
}

function getRemoteInstitutionId(account: MastercardRemoteAccount) {
  return normalizeId(account.institutionId ?? account.institutionLoginId);
}

function accountMask(account: MastercardRemoteAccount) {
  const display = account.accountNumberDisplay ?? account.realAccountNumberLast4;
  if (!display) {
    return undefined;
  }
  const digits = display.replace(/\D/g, "").slice(-4);
  return digits ? `•••• ${digits}` : display;
}

function currentBalance(account: MastercardRemoteAccount) {
  return Number(
    account.balance ??
      account.currentBalance ??
      account.detail?.currentBalance ??
      account.detail?.availableCashBalance ??
      0,
  );
}

function availableBalance(account: MastercardRemoteAccount) {
  const value =
    account.availableBalance ??
    account.detail?.availableBalanceAmount ??
    account.detail?.availableCashBalance;
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function unixToIso(value?: number) {
  if (!value || !Number.isFinite(value)) {
    return undefined;
  }
  return new Date(value * 1000).toISOString();
}

function normalizeTransactionType(tx: MastercardRemoteTransaction) {
  const rawType = tx.type?.toLowerCase();
  if (rawType?.includes("credit") || (tx.amount ?? 0) > 0) {
    return "credit" as const;
  }
  if (rawType?.includes("debit") || (tx.amount ?? 0) < 0) {
    return "debit" as const;
  }
  return "unknown" as const;
}

export const mastercardRepository = {
  async getCustomerByUserId(appUserId: string): Promise<MastercardCustomer | null> {
    const store = await readStore();
    const record = store.customers.find((customer) => customer.appUserId === appUserId);
    if (!record) {
      return null;
    }

    return {
      appUserId: record.appUserId,
      customerId: decryptIdentifier(record.customerIdEncrypted),
      username: record.username,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  },

  async saveCustomer(input: {
    appUserId: string;
    customerId: string;
    username: string;
  }): Promise<MastercardCustomer> {
    const store = await readStore();
    const existing = store.customers.find(
      (customer) => customer.appUserId === input.appUserId,
    );
    const timestamp = nowIso();
    const record: StoredCustomerRecord = {
      id: existing?.id ?? crypto.randomUUID(),
      appUserId: input.appUserId,
      customerIdEncrypted: encryptIdentifier(input.customerId),
      customerKey: hashIdentifier(input.customerId),
      username: input.username,
      createdAt: existing?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };

    store.customers = existing
      ? store.customers.map((customer) =>
          customer.id === existing.id ? record : customer,
        )
      : [...store.customers, record];
    await writeStore(store);

    return {
      appUserId: record.appUserId,
      customerId: input.customerId,
      username: record.username,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  },

  async upsertAccounts(
    appUserId: string,
    customerId: string,
    accounts: MastercardRemoteAccount[],
  ) {
    const store = await readStore();
    const timestamp = nowIso();
    const customerKey = hashIdentifier(customerId);

    for (const account of accounts) {
      const accountId = getRemoteAccountId(account);
      if (!accountId) {
        continue;
      }

      const accountKey = hashIdentifier(accountId);
      const institutionId = getRemoteInstitutionId(account);
      const existing = store.linkedAccounts.find(
        (stored) =>
          stored.appUserId === appUserId && stored.accountKey === accountKey,
      );
      const linked: StoredLinkedAccountRecord = {
        id: existing?.id ?? crypto.randomUUID(),
        appUserId,
        accountKey,
        accountIdEncrypted:
          existing?.accountIdEncrypted ?? encryptIdentifier(accountId),
        customerKey,
        institutionKey: institutionId ? hashIdentifier(institutionId) : undefined,
        institutionIdEncrypted: institutionId
          ? existing?.institutionIdEncrypted ?? encryptIdentifier(institutionId)
          : undefined,
        name:
          account.accountNickname ??
          account.name ??
          `${account.type ?? "Bank"} account`,
        type: account.type ?? "unknown",
        status: account.status ?? "active",
        currency: account.currency ?? "USD",
        mask: accountMask(account),
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp,
      };

      store.linkedAccounts = existing
        ? store.linkedAccounts.map((stored) =>
            stored.id === existing.id ? linked : stored,
          )
        : [...store.linkedAccounts, linked];

      const balance: AccountBalance = {
        id: existing?.id ?? crypto.randomUUID(),
        appUserId,
        accountKey,
        currentBalance: currentBalance(account),
        availableBalance: availableBalance(account),
        currency: account.currency ?? "USD",
        asOf: timestamp,
      };
      const existingBalance = store.balances.find(
        (stored) =>
          stored.appUserId === appUserId && stored.accountKey === accountKey,
      );
      store.balances = existingBalance
        ? store.balances.map((stored) =>
            stored.id === existingBalance.id ? balance : stored,
          )
        : [...store.balances, balance];
    }

    await writeStore(store);
  },

  async listAccounts(appUserId: string): Promise<LinkedAccount[]> {
    const store = await readStore();
    return store.linkedAccounts
      .filter((account) => account.appUserId === appUserId)
      .map((account) => ({
        id: account.id,
        appUserId: account.appUserId,
        accountKey: account.accountKey,
        customerKey: account.customerKey,
        institutionKey: account.institutionKey,
        name: account.name,
        type: account.type,
        status: account.status,
        currency: account.currency,
        mask: account.mask,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  async listBalances(appUserId: string): Promise<AccountBalance[]> {
    const store = await readStore();
    return store.balances
      .filter((balance) => balance.appUserId === appUserId)
      .sort((a, b) => a.accountKey.localeCompare(b.accountKey));
  },

  async upsertTransactions(
    appUserId: string,
    transactions: MastercardRemoteTransaction[],
  ) {
    const store = await readStore();
    const timestamp = nowIso();

    for (const tx of transactions) {
      const remoteTransactionId = normalizeId(tx.id ?? tx.transactionId);
      const remoteAccountId = normalizeId(tx.accountId);
      if (!remoteTransactionId || !remoteAccountId) {
        continue;
      }

      const transactionKey = hashIdentifier(remoteTransactionId);
      const existing = store.transactions.find(
        (stored) =>
          stored.appUserId === appUserId &&
          stored.transactionKey === transactionKey,
      );
      const category =
        tx.category ??
        tx.categorization?.category ??
        tx.categorization?.bestRepresentation ??
        "Uncategorized";
      const description =
        tx.description ??
        tx.memo ??
        tx.categorization?.normalizedPayeeName ??
        "Transaction";
      const postedAt =
        unixToIso(tx.postedDate ?? tx.createdDate) ?? timestamp;

      const stored: StoredTransaction = {
        id: existing?.id ?? crypto.randomUUID(),
        appUserId,
        accountKey: hashIdentifier(remoteAccountId),
        transactionKey,
        amount: Number(tx.amount ?? 0),
        description,
        normalizedPayee: tx.categorization?.normalizedPayeeName,
        postedAt,
        transactedAt: unixToIso(tx.transactionDate),
        category,
        type: normalizeTransactionType(tx),
        status: tx.status ?? "posted",
        currency: tx.currency ?? "USD",
        createdAt: existing?.createdAt ?? timestamp,
      };

      store.transactions = existing
        ? store.transactions.map((item) => (item.id === existing.id ? stored : item))
        : [...store.transactions, stored];
    }

    await writeStore(store);
  },

  async listTransactions(
    appUserId: string,
    options?: { from?: Date; to?: Date },
  ): Promise<StoredTransaction[]> {
    const store = await readStore();
    return store.transactions
      .filter((tx) => {
        if (tx.appUserId !== appUserId) {
          return false;
        }
        const posted = new Date(tx.postedAt).getTime();
        if (options?.from && posted < options.from.getTime()) {
          return false;
        }
        if (options?.to && posted > options.to.getTime()) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.postedAt.localeCompare(a.postedAt));
  },

  async addAuditLog(entry: AuditLogRecord) {
    const store = await readStore();
    store.auditLogs = [entry, ...store.auditLogs].slice(0, 1000);
    await writeStore(store);
  },
};
