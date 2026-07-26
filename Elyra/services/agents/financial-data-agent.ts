import {
  getCashFlowSummary,
  getNetWorth,
  getUserAccounts,
  getUserBalances,
  getUserTransactions,
} from "./financial-tools";
import type {
  FinancialDataAgentResult,
  FinancialInsight,
  StoredTransaction,
} from "@/services/mastercard/types";

const CATEGORY_RULES: Array<{ category: string; pattern: RegExp }> = [
  { category: "Dining", pattern: /restaurant|cafe|coffee|doordash|uber eats|dining/i },
  { category: "Groceries", pattern: /grocery|market|whole foods|trader joe|costco/i },
  { category: "Transport", pattern: /uber|lyft|fuel|gas|metro|parking/i },
  { category: "Subscriptions", pattern: /netflix|spotify|apple|amazon|google|hulu|adobe|openai/i },
  { category: "Housing", pattern: /rent|mortgage|property/i },
  { category: "Income", pattern: /payroll|salary|deposit|stripe|direct dep/i },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function categorize(tx: StoredTransaction) {
  if (tx.category && tx.category !== "Uncategorized") {
    return tx.category;
  }

  const text = `${tx.description} ${tx.normalizedPayee ?? ""}`;
  return CATEGORY_RULES.find((rule) => rule.pattern.test(text))?.category ?? "Other";
}

function merchantName(tx: StoredTransaction) {
  return (tx.normalizedPayee ?? tx.description)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function detectSubscriptions(transactions: StoredTransaction[]) {
  const groups = new Map<string, StoredTransaction[]>();

  for (const tx of transactions) {
    if (tx.type !== "debit" && tx.amount >= 0) {
      continue;
    }
    const key = `${merchantName(tx).toLowerCase()}:${Math.round(Math.abs(tx.amount))}`;
    const existing = groups.get(key) ?? [];
    existing.push(tx);
    groups.set(key, existing);
  }

  return Array.from(groups.values())
    .filter((items) => items.length >= 2)
    .map((items) => ({
      merchant: merchantName(items[0]),
      amount: Math.abs(items[0].amount),
      cadence: "monthly" as const,
      count: items.length,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);
}

function detectUnusualExpenses(transactions: StoredTransaction[]) {
  const expenses = transactions
    .filter((tx) => tx.type === "debit" || tx.amount < 0)
    .map((tx) => ({ ...tx, amountAbs: Math.abs(tx.amount) }));

  if (expenses.length === 0) {
    return [];
  }

  const average =
    expenses.reduce((sum, tx) => sum + tx.amountAbs, 0) / expenses.length;
  const variance =
    expenses.reduce((sum, tx) => sum + (tx.amountAbs - average) ** 2, 0) /
    expenses.length;
  const threshold = Math.max(200, average + Math.sqrt(variance) * 1.8);

  return expenses
    .filter((tx) => tx.amountAbs >= threshold)
    .sort((a, b) => b.amountAbs - a.amountAbs)
    .slice(0, 5)
    .map((tx) => {
      const sanitized: Partial<typeof tx> = { ...tx };
      delete sanitized.amountAbs;
      return sanitized as StoredTransaction;
    });
}

function priorWindow(date: Date, days: number) {
  const toDate = new Date(date.getTime() - days * 86_400_000);
  const fromDate = new Date(toDate.getTime() - days * 86_400_000);
  return { fromDate, toDate };
}

export async function runFinancialDataAgent(
  appUserId: string,
): Promise<FinancialDataAgentResult> {
  const now = new Date();
  const fromDate = new Date(now.getTime() - 30 * 86_400_000);
  const [accounts, balances, transactions, cashFlow, netWorth, previousCashFlow] =
    await Promise.all([
      getUserAccounts(appUserId),
      getUserBalances(appUserId),
      getUserTransactions(appUserId, { fromDate, toDate: now }),
      getCashFlowSummary(appUserId, { fromDate, toDate: now }),
      getNetWorth(appUserId),
      getCashFlowSummary(appUserId, priorWindow(now, 30)),
    ]);

  const categorizedTransactions = transactions.map((tx) => ({
    ...tx,
    category: categorize(tx),
  }));
  const subscriptions = detectSubscriptions(categorizedTransactions);
  const unusualExpenses = detectUnusualExpenses(categorizedTransactions);
  const insights: FinancialInsight[] = [];

  if (previousCashFlow.spending > 0) {
    const delta =
      (cashFlow.spending - previousCashFlow.spending) / previousCashFlow.spending;
    const pct = Math.round(delta * 100);
    if (Math.abs(pct) >= 5) {
      insights.push({
        title:
          pct > 0
            ? `Spending increased ${pct}% this month`
            : `Spending decreased ${Math.abs(pct)}% this month`,
        detail: `Current spending is ${formatCurrency(cashFlow.spending)} versus ${formatCurrency(previousCashFlow.spending)} in the prior 30-day window.`,
        severity: pct > 0 ? "warning" : "positive",
      });
    }
  }

  const dining = cashFlow.topCategories.find((item) =>
    /dining|restaurant|food/i.test(item.category),
  );
  if (dining) {
    insights.push({
      title: `You spent ${formatCurrency(dining.amount)} on dining`,
      detail: "Dining is one of the largest discretionary categories in the linked account data.",
      severity: "info",
    });
  }

  if (subscriptions.length > 0) {
    insights.push({
      title: `You have ${subscriptions.length} recurring subscriptions`,
      detail: subscriptions
        .slice(0, 3)
        .map((subscription) => subscription.merchant)
        .join(", "),
      severity: "info",
    });
  }

  if (cashFlow.netCashFlow > 0) {
    const investable = Math.floor(cashFlow.netCashFlow / 100) * 100;
    if (investable > 0) {
      insights.push({
        title: `You can allocate about ${formatCurrency(investable)}/month`,
        detail: "This estimate is based on positive cash flow after the last 30 days of spending.",
        severity: "positive",
      });
    }
  }

  const portfolioRecommendations = [
    cashFlow.netCashFlow > 0
      ? `Route up to ${formatCurrency(Math.max(0, Math.floor(cashFlow.netCashFlow / 100) * 100))}/month into an automated investment plan after emergency cash is funded.`
      : "Pause new risk allocation until monthly cash flow turns positive.",
    cashFlow.monthlyBurn > 0
      ? `Keep at least ${formatCurrency(cashFlow.monthlyBurn * 3)} in liquid reserves for a three-month runway.`
      : "Build a cash reserve target once at least one full month of transactions is available.",
    unusualExpenses.length > 0
      ? "Review unusual expenses before increasing trading allocation."
      : "No unusual expenses were detected in the current window.",
  ];

  return {
    accounts,
    balances,
    transactionsAnalyzed: categorizedTransactions.length,
    cashFlow: {
      ...cashFlow,
      topCategories: cashFlow.topCategories.map((item) => ({
        ...item,
        category: item.category === "Uncategorized" ? "Other" : item.category,
      })),
    },
    netWorth,
    subscriptions,
    unusualExpenses,
    insights,
    portfolioRecommendations,
  };
}
