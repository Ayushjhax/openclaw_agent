"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  WalletCards,
  X,
} from "lucide-react";
import type { FinancialDataAgentResult } from "@/services/mastercard/types";

type ConnectedAccountsPanelProps = {
  open: boolean;
  appUserId?: string | null;
  isAuthenticated: boolean;
  onClose: () => void;
  onLogin: () => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number | null) {
  if (value === null || !Number.isFinite(value)) {
    return "N/A";
  }
  return `${Math.round(value * 100)}%`;
}

function SkeletonRows() {
  return (
    <div className="space-y-3" aria-hidden>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-20 rounded-lg border border-white/8 bg-white/[0.04] p-4"
        >
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="mt-4 h-5 w-48 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function ConnectedAccountsPanel({
  open,
  appUserId,
  isAuthenticated,
  onClose,
  onLogin,
}: ConnectedAccountsPanelProps) {
  const [data, setData] = useState<FinancialDataAgentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(appUserId ? { "x-elyra-user-id": appUserId } : {}),
    }),
    [appUserId],
  );

  const loadAccounts = useCallback(async () => {
    if (!open || !isAuthenticated || !appUserId) {
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/mastercard/accounts", {
        method: "GET",
        headers,
        cache: "no-store",
      });
      const payload = (await response.json()) as
        | FinancialDataAgentResult
        | { error?: string };
      if (!response.ok) {
        throw new Error("error" in payload ? payload.error : "Could not load accounts.");
      }
      setData(payload as FinancialDataAgentResult);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load connected accounts.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [appUserId, headers, isAuthenticated, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    queueMicrotask(() => {
      void loadAccounts();
    });
  }, [loadAccounts]);

  const handleConnect = async () => {
    if (!isAuthenticated) {
      onLogin();
      return;
    }
    if (!appUserId) {
      setError("Sign in again before connecting a bank account.");
      return;
    }

    setIsConnecting(true);
    setError("");
    try {
      const response = await fetch("/api/mastercard/connect-url", {
        method: "POST",
        headers,
        body: JSON.stringify({ appUserId }),
      });
      const payload = (await response.json()) as {
        connectUrl?: string;
        error?: string;
      };
      if (!response.ok || !payload.connectUrl) {
        throw new Error(payload.error ?? "Could not start bank connection.");
      }
      window.location.assign(payload.connectUrl);
    } catch (connectError) {
      setError(
        connectError instanceof Error
          ? connectError.message
          : "Could not start bank connection.",
      );
      setIsConnecting(false);
    }
  };

  const handleRefresh = async () => {
    if (!appUserId) {
      setError("Sign in again before refreshing accounts.");
      return;
    }

    setIsRefreshing(true);
    setError("");
    try {
      const response = await fetch("/api/mastercard/accounts/refresh", {
        method: "POST",
        headers,
        body: JSON.stringify({ appUserId }),
      });
      const payload = (await response.json()) as
        | FinancialDataAgentResult
        | { error?: string };
      if (!response.ok) {
        throw new Error("error" in payload ? payload.error : "Could not refresh accounts.");
      }
      setData(payload as FinancialDataAgentResult);
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : "Could not refresh accounts.",
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!open) {
    return null;
  }

  const accounts = data?.accounts ?? [];
  const balancesByAccount = new Map(
    (data?.balances ?? []).map((balance) => [balance.accountKey, balance]),
  );

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-md sm:py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="connected-accounts-title"
    >
      <div className="relative w-full max-w-5xl rounded-xl border border-white/10 bg-black text-white shadow-2xl shadow-black/60">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Settings
            </p>
            <h2
              id="connected-accounts-title"
              className="mt-2 text-xl font-semibold tracking-tight text-white"
            >
              Connected Accounts
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-white/60">
              Link bank data through Mastercard Open Finance so Elyra can analyze
              balances, cash flow, subscriptions, and investable surplus.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close connected accounts"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleConnect}
                disabled={isConnecting}
                aria-busy={isConnecting}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-500/25 focus-visible:ring-2 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isConnecting ? (
                  <RefreshCw className="animate-spin" size={16} aria-hidden="true" />
                ) : (
                  <Building2 size={16} aria-hidden="true" />
                )}
                Connect Bank Account
              </button>
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing || !isAuthenticated}
                aria-busy={isRefreshing}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={isRefreshing ? "animate-spin" : ""}
                  size={16}
                  aria-hidden="true"
                />
                Refresh Accounts
              </button>
            </div>

            {!isAuthenticated ? (
              <div className="rounded-lg border border-amber-300/25 bg-amber-500/10 p-4">
                <p className="text-sm font-semibold text-amber-100">
                  Sign in to connect bank accounts
                </p>
                <p className="mt-1 text-sm text-amber-100/70">
                  Elyra stores linked account IDs server-side and never exposes
                  Mastercard partner credentials to the browser.
                </p>
                <button
                  type="button"
                  onClick={onLogin}
                  className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-amber-200/30 bg-amber-300/15 px-4 py-2 text-sm font-semibold text-amber-50 transition hover:bg-amber-300/25 focus-visible:ring-2 focus-visible:ring-amber-100"
                >
                  Sign in
                </button>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-lg border border-rose-400/25 bg-rose-500/10 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className="mt-0.5 shrink-0 text-rose-200"
                    size={18}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold text-rose-100">
                      Could not update connected accounts
                    </p>
                    <p className="mt-1 text-sm text-rose-100/70">{error}</p>
                    <button
                      type="button"
                      onClick={() => void loadAccounts()}
                      className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-rose-200/30 bg-rose-300/10 px-3 py-2 text-sm font-semibold text-rose-50 transition hover:bg-rose-300/20 focus-visible:ring-2 focus-visible:ring-rose-100"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            {isLoading ? <SkeletonRows /> : null}

            {!isLoading && isAuthenticated && accounts.length === 0 ? (
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center">
                <WalletCards
                  className="mx-auto text-white/55"
                  size={36}
                  aria-hidden="true"
                />
                <p className="mt-4 text-sm font-semibold text-white">
                  No bank accounts connected
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/60">
                  Connect a checking, savings, or credit account to unlock cash
                  flow-aware portfolio recommendations.
                </p>
                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-500/25 focus-visible:ring-2 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowUpRight size={16} aria-hidden="true" />
                  Connect Bank Account
                </button>
              </div>
            ) : null}

            {!isLoading && accounts.length > 0 ? (
              <div className="space-y-3">
                {accounts.map((account) => {
                  const balance = balancesByAccount.get(account.accountKey);
                  return (
                    <div
                      key={account.id}
                      className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70">
                            <CreditCard size={18} aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {account.name}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/45">
                              {account.type} {account.mask ? ` / ${account.mask}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <p className="font-mono text-lg font-semibold text-white">
                            {formatCurrency(balance?.currentBalance ?? 0)}
                          </p>
                          <p className="text-xs text-white/45">
                            Available{" "}
                            {formatCurrency(
                              balance?.availableBalance ??
                                balance?.currentBalance ??
                                0,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </section>

          <aside className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-2 text-white/70">
                <ShieldCheck size={17} aria-hidden="true" />
                <p className="text-sm font-semibold text-white">Security</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-white/58">
                <li>Partner secrets stay server-side.</li>
                <li>Account identifiers are encrypted at rest.</li>
                <li>API calls are rate limited and audit logged.</li>
              </ul>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Cash Flow
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-white/45">Income</p>
                  <p className="font-mono text-sm text-emerald-200">
                    {formatCurrency(data?.cashFlow.income ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/45">Spending</p>
                  <p className="font-mono text-sm text-rose-200">
                    {formatCurrency(data?.cashFlow.spending ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/45">Monthly burn</p>
                  <p className="font-mono text-sm text-white">
                    {formatCurrency(data?.cashFlow.monthlyBurn ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/45">Savings rate</p>
                  <p className="font-mono text-sm text-white">
                    {formatPercent(data?.cashFlow.savingsRate ?? null)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                AI Insights
              </p>
              <div className="mt-3 space-y-3">
                {(data?.insights ?? []).length > 0 ? (
                  (data?.insights ?? []).slice(0, 4).map((insight) => (
                    <div key={`${insight.title}:${insight.detail}`}>
                      <p className="text-sm font-semibold text-white">
                        {insight.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-white/55">
                        {insight.detail}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-white/55">
                    Connect accounts and refresh transactions to generate
                    personalized cash flow insights.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
