export type MastercardAccessToken = {
  token: string;
  expiresAt: number;
};

export type MastercardCustomer = {
  appUserId: string;
  customerId: string;
  username: string;
  createdAt: string;
  updatedAt: string;
};

export type MastercardConnectUrl = {
  connectUrl: string;
  customerId: string;
  expiresAt?: string;
};

export type MastercardRemoteAccount = {
  id?: string | number;
  accountId?: string | number;
  realAccountNumberLast4?: string;
  accountNumberDisplay?: string;
  institutionId?: string | number;
  institutionLoginId?: string | number;
  name?: string;
  accountNickname?: string;
  type?: string;
  status?: string;
  currency?: string;
  balance?: number;
  availableBalance?: number;
  currentBalance?: number;
  detail?: {
    availableBalanceAmount?: number;
    currentBalance?: number;
    availableCashBalance?: number;
  };
};

export type MastercardRemoteTransaction = {
  id?: string | number;
  transactionId?: string | number;
  accountId?: string | number;
  amount?: number;
  description?: string;
  memo?: string;
  postedDate?: number;
  transactionDate?: number;
  createdDate?: number;
  type?: string;
  status?: string;
  currency?: string;
  categorization?: {
    normalizedPayeeName?: string;
    category?: string;
    bestRepresentation?: string;
  };
  category?: string;
};

export type LinkedAccount = {
  id: string;
  appUserId: string;
  accountKey: string;
  customerKey: string;
  institutionKey?: string;
  name: string;
  type: string;
  status: string;
  currency: string;
  mask?: string;
  createdAt: string;
  updatedAt: string;
};

export type AccountBalance = {
  id: string;
  appUserId: string;
  accountKey: string;
  currentBalance: number;
  availableBalance?: number;
  currency: string;
  asOf: string;
};

export type StoredTransaction = {
  id: string;
  appUserId: string;
  accountKey: string;
  transactionKey: string;
  amount: number;
  description: string;
  normalizedPayee?: string;
  postedAt: string;
  transactedAt?: string;
  category: string;
  type: "credit" | "debit" | "unknown";
  status: string;
  currency: string;
  createdAt: string;
};

export type CashFlowSummary = {
  from: string;
  to: string;
  income: number;
  spending: number;
  netCashFlow: number;
  monthlyBurn: number;
  savingsRate: number | null;
  topCategories: Array<{ category: string; amount: number }>;
};

export type FinancialInsight = {
  title: string;
  detail: string;
  severity: "info" | "positive" | "warning";
};

export type FinancialDataAgentResult = {
  accounts: LinkedAccount[];
  balances: AccountBalance[];
  transactionsAnalyzed: number;
  cashFlow: CashFlowSummary;
  netWorth: number;
  subscriptions: Array<{
    merchant: string;
    amount: number;
    cadence: "monthly" | "weekly" | "unknown";
    count: number;
  }>;
  unusualExpenses: StoredTransaction[];
  insights: FinancialInsight[];
  portfolioRecommendations: string[];
};

