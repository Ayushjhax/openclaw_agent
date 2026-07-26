# Mastercard Open Finance Integration

This MVP adds a server-side Mastercard Open Finance (Finicity) integration to Elyra without adding a new runtime dependency. The current app uses Next.js API routes as the Node/TypeScript backend; production can replace the local repository with a Postgres adapter using the schema in `database/mastercard_open_finance.sql`.

## Folder Structure

```text
Elyra/
  app/api/mastercard/
    connect-url/route.ts
    accounts/route.ts
    accounts/refresh/route.ts
    transactions/route.ts
    callback/route.ts
  components/
    ConnectedAccountsPanel.tsx
  database/
    mastercard_open_finance.sql
  docs/
    mastercard-open-finance-integration.md
  services/
    agents/
      financial-data-agent.ts
      financial-tools.ts
    mastercard/
      audit.ts
      config.ts
      encryption.ts
      index.ts
      rate-limit.ts
      repository.ts
      types.ts
```

## TypeScript Interfaces

Core interfaces live in `services/mastercard/types.ts`:

- `MastercardAccessToken`
- `MastercardCustomer`
- `MastercardConnectUrl`
- `LinkedAccount`
- `AccountBalance`
- `StoredTransaction`
- `CashFlowSummary`
- `FinancialDataAgentResult`

## API Routes

- `POST /api/mastercard/connect-url`: creates/reuses a Mastercard customer and returns a Data Connect URL.
- `GET /api/mastercard/accounts`: returns connected accounts, balances, cash-flow summary, and AI insights.
- `POST /api/mastercard/accounts/refresh`: refreshes Mastercard accounts, stores balances, and returns the same summary payload.
- `GET /api/mastercard/transactions`: fetches and stores transactions for an optional `from`/`to` date range.
- `GET /api/mastercard/callback`: redirects back to Elyra and reopens the Connected Accounts panel.

All routes expect the current user id in `x-elyra-user-id` or `appUserId`. This matches the current client-side Privy usage. For production, verify Privy JWTs server-side before trusting the user id.

## Service Layer

`services/mastercard/index.ts` exports:

- `createAccessToken()`
- `createCustomer()`
- `generateConnectUrl()`
- `refreshAccounts()`
- `getAccounts()`
- `getTransactions()`
- `getBalances()`

The service keeps partner secrets on the server, caches partner access tokens briefly, and normalizes Mastercard account/transaction payloads before persistence.

## Database Schema

`database/mastercard_open_finance.sql` creates:

- `mastercard_customers`
- `linked_accounts`
- `account_balances`
- `transactions`
- `mastercard_audit_logs`

Account, customer, institution, and transaction identifiers are encrypted or hashed before storage. The MVP repository stores the same shape in `.data/mastercard-open-finance.json` for local development.

## React Components

`components/ConnectedAccountsPanel.tsx` implements:

- Settings -> Connected Accounts
- Connect Bank Account
- Connected account list
- Balances
- Cash-flow summary
- AI insight preview
- Loading, empty, error, and unauthenticated states

The profile menu in `Navbar.tsx` opens this panel.

## Agent Integration

`services/agents/financial-tools.ts` exports tools other agents can call:

- `getUserAccounts()`
- `getUserBalances()`
- `getUserTransactions()`
- `getCashFlowSummary()`
- `getNetWorth()`

`services/agents/financial-data-agent.ts` adds `runFinancialDataAgent()`, which categorizes spending, detects recurring subscriptions, flags unusual expenses, calculates monthly burn, estimates savings rate, and generates portfolio recommendations.

The assistant route adds financial context to Gemini when the prompt asks about bank data, spending, cash flow, subscriptions, savings rate, budget, net worth, or portfolio allocation.

## Step-by-Step Integration Plan

1. Put Mastercard credentials in `.env.local` using the variables in `.env.example`.
2. Set `MASTERCARD_CONNECT_REDIRECT_URI` to `/api/mastercard/callback` for local testing.
3. Start Elyra and sign in with Privy.
4. Open profile -> Connected Accounts -> Connect Bank Account.
5. Complete Mastercard Connect.
6. Return to Elyra and click Refresh Accounts.
7. Ask the assistant cash-flow questions such as "How much can I allocate to investments monthly?"
8. Replace the local JSON repository with a production Postgres adapter using `database/mastercard_open_finance.sql`.

## Production Deployment Checklist

- Rotate the Mastercard partner secret because it was shared during setup.
- Store `MASTERCARD_PARTNER_SECRET` and `MASTERCARD_ENCRYPTION_KEY` in the deployment secret manager.
- Use a 32-byte random `MASTERCARD_ENCRYPTION_KEY` and back it up securely.
- Verify Privy JWTs server-side on every Mastercard API route.
- Run the Postgres schema and move persistence out of the local JSON repository.
- Configure Mastercard webhook URL and validate webhook signatures if enabled.
- Set strict CORS and origin checks for callback/webhook routes.
- Add request/response redaction to application logs.
- Monitor `mastercard_audit_logs` for failed auth, refresh, and transaction sync attempts.
- Add background sync for account refresh and transaction backfill.
- Add data deletion flows for user account removal and bank disconnect.
- Confirm Mastercard production app review, redirect URI allowlist, and privacy policy copy.

