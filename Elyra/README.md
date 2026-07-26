# Elyra Frontend

This is the Next.js frontend for the Elyra trading interface. It provides the wallet-connected UI, trading terminal components, and the server routes that back the in-app assistant experience.

The backend research pipeline lives in the repository root. See the top-level [`README.md`](../README.md) for the Python setup.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) after the dev server starts.

## Required environment variables

These are required for the app to boot correctly:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy application ID |
| `NEXT_PUBLIC_PRIVY_CLIENT_ID` | Privy client ID |

Without those values, `app/providers.tsx` throws during startup.

## Common optional environment variables

These appear in `.env.example` and power optional integrations:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Solana RPC endpoint for balances and transactions |
| `PYTH_LAZER_ACCESS_TOKEN` | Server-side Pyth price proxy access |
| `GEMINI_API_KEY` | Assistant responses in `app/api/assistant/chat/route.ts` |
| `GEMINI_MODEL` | Gemini model override |
| `JUPITER_API_KEY` | Optional Jupiter Pro API key |
| `DEXSCREENER_BASE_URL` | Dexscreener API override |
| `DRIFT_DATA_API_BASE_URL` | Drift data API override |
| `DFLOW_PREDICTION_MARKETS_BASE_URL` | DFlow prediction markets API override |
| `MASTERCARD_PARTNER_ID` | Server-side Mastercard Open Finance partner ID |
| `MASTERCARD_APP_KEY` / `MASTERCARD_APP_NAME` | Server-side Mastercard app key/name header value |
| `MASTERCARD_PARTNER_SECRET` | Server-side Mastercard partner secret |
| `MASTERCARD_ENCRYPTION_KEY` | 32-byte key used to encrypt stored Mastercard identifiers |
| `MASTERCARD_CONNECT_REDIRECT_URI` | Mastercard Connect return URL |

Never prefix Mastercard secrets with `NEXT_PUBLIC_`; those values must not be exposed to the browser.

## Useful scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Key files

- `app/page.tsx`: main trading terminal page
- `app/providers.tsx`: Privy setup and invite-route guard
- `app/api/assistant/chat/route.ts`: assistant backend, Gemini integration, and data helpers
- `components/`: terminal, assistant, chart, wallet, and modal UI components
- `services/mastercard/`: Mastercard Open Finance service, local repository, encryption, rate limiting, and audit helpers
- `services/agents/financial-data-agent.ts`: cash-flow insights agent backed by linked bank data
- `database/mastercard_open_finance.sql`: production Postgres schema for Mastercard data
- `docs/mastercard-open-finance-integration.md`: integration plan and deployment checklist

## Notes

- This app uses Next.js 16, React 19, and Tailwind CSS 4.
- `NEXT_PUBLIC_SOLANA_RPC_URL` falls back to Solana mainnet if you leave it empty, but a dedicated RPC endpoint is recommended for reliability.
