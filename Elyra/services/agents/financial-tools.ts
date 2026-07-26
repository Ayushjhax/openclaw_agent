import {
  getAccounts,
  getBalances,
  getTransactions,
} from "@/services/mastercard";
import type {
  AccountBalance,
  CashFlowSummary,
  LinkedAccount,
  StoredTransaction,
} from "@/services/mastercard/types";

export type DateRangeInput = {
  fromDate?: Date;
  toDate?: Date;
};

function isDebit(tx: StoredTransaction) {
  return tx.type === "debit" || tx.amount < 0;
}

function isCredit(tx: StoredTransaction) {
  return tx.type === "credit" || tx.amount > 0;
}

export async function getUserAccounts(
  appUserId: string,
): Promise<LinkedAccount[]> {
  return getAccounts(appUserId);
}

export async function getUserBalances(
  appUserId: string,
): Promise<AccountBalance[]> {
  return getBalances(appUserId);
}

export async function getUserTransactions(
  appUserId: string,
  range: DateRangeInput = {},
): Promise<StoredTransaction[]> {
  return getTransactions(appUserId, range);
}

export async function getCashFlowSummary(
  appUserId: string,
  range: DateRangeInput = {},
): Promise<CashFlowSummary> {
  const toDate = range.toDate ?? new Date();
  const fromDate =
    range.fromDate ?? new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const transactions = await getUserTransactions(appUserId, {
    fromDate,
    toDate,
  });

  const income = transactions
    .filter(isCredit)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const spending = transactions
    .filter(isDebit)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const byCategory = new Map<string, number>();

  for (const tx of transactions.filter(isDebit)) {
    byCategory.set(
      tx.category,
      (byCategory.get(tx.category) ?? 0) + Math.abs(tx.amount),
    );
  }

  const days = Math.max(1, (toDate.getTime() - fromDate.getTime()) / 86_400_000);
  const monthlyBurn = spending * (30 / days);

  return {
    from: fromDate.toISOString(),
    to: toDate.toISOString(),
    income,
    spending,
    netCashFlow: income - spending,
    monthlyBurn,
    savingsRate: income > 0 ? (income - spending) / income : null,
    topCategories: Array.from(byCategory.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5),
  };
}

export async function getNetWorth(appUserId: string) {
  const balances = await getUserBalances(appUserId);
  return balances.reduce((sum, balance) => sum + balance.currentBalance, 0);
}

