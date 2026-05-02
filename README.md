# OpenClaw Agent / Elyra

This repository contains the research pipeline and web client behind Elyra. The Python code in the repo root handles market intelligence and report generation, while [`Elyra/`](Elyra/README.md) contains the Next.js trading interface.

## What this repo does

- Collects BTC, ETH, and SOL prices from Binance
- Runs basic technical analysis with EMA and RSI
- Summarizes Solana whale-transfer activity through Helius
- Classifies crypto news sentiment from NewsData.io
- Scans Polymarket for opportunities, clustering, and arbitrage/watchlist setups
- Generates a final research report with Gemini, with a static fallback if no LLM key is configured
- Ships a separate frontend in `Elyra/` for wallet-connected trading UX

## Repository layout

```text
.
|-- main.py                       # main backend CLI entrypoint
|-- run.py                        # thin wrapper around main.py
|-- agents/                       # market, quant, news, and on-chain agents
|-- collectors/                   # API clients for Binance, Helius, and NewsData
|-- analysis/                     # indicator calculations
|-- research/                     # report synthesis and fallback reporting
|-- skills/trade_research/        # Polymarket analysis pipeline
|-- assets/                       # project screenshots and media
|-- .env.example                  # backend environment template
|-- requirements.txt              # Python dependencies
`-- Elyra/                        # Next.js frontend
```

## Backend quick start

Python 3.10+ is recommended because the codebase uses modern type syntax such as `str | None`.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python3 main.py
```

The backend needs network access for live API calls.

## Backend configuration

Copy `.env.example` to `.env` and fill in the keys you want to enable:

```bash
cp .env.example .env
```

| Variable | Used for | Required |
| --- | --- | --- |
| `HELIUS_API_KEY` | Solana on-chain whale activity | Optional |
| `NEWSDATA_API_KEY` | Crypto headline collection and sentiment | Optional |
| `GEMINI_API_KEY` | AI-written research reports | Optional |

Notes:

- If `GEMINI_API_KEY` is missing, `research/synthesizer.py` falls back to a static report template.
- `research/synthesizer.py` also accepts `GOOGLE_API_KEY` if you already use that name locally.
- Missing `HELIUS_API_KEY` or `NEWSDATA_API_KEY` does not stop the whole pipeline; those sections are skipped or replaced with fallback output.

## Backend usage

Run the full pipeline:

```bash
python3 main.py
```

That command runs six steps:

1. Market prices from Binance
2. Quant analysis for `BTCUSDT`
3. Solana whale-transfer summary
4. News sentiment
5. Polymarket opportunity scan
6. Final report synthesis

Run only the Polymarket workflow:

```bash
python3 main.py polymarket
python3 main.py polymarket --json
python3 main.py polymarket --top 10 --max-markets 800
```

Run individual modules directly:

```bash
python3 agents/market_agent.py
python3 agents/quant_agent.py ETHUSDT
python3 agents/onchain_agent.py <solana_wallet_address>
python3 agents/news_agent.py
python3 -m skills.trade_research.trade_research --top 5 --json
```

## Polymarket notes

- The trade-research pipeline prefers `sentence-transformers` for semantic clustering.
- If that package or model is unavailable, the code falls back to a TF-IDF based clustering path.
- The first semantic-clustering run may download a Hugging Face model into `.cache/huggingface/`.

## Frontend quick start

The `Elyra/` folder is a separate Next.js app.

```bash
cd Elyra
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) after the dev server starts.

Frontend details and environment variables are documented in [`Elyra/README.md`](Elyra/README.md).

## Troubleshooting

- `ModuleNotFoundError: No module named 'dotenv'`: install backend dependencies with `pip install -r requirements.txt`.
- On-chain analysis is skipped: check `HELIUS_API_KEY` or Helius quota limits.
- News sentiment is skipped: check `NEWSDATA_API_KEY`.
- Gemini report generation falls back to static output: check `GEMINI_API_KEY` and outbound network access.
- Polymarket clustering is slower on first run: the embedding model may still be downloading.
