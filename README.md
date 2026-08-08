# Elyra — The Sovereign Capital Autonomy

**[getelyra.xyz](https://getelyra.xyz) · [try.getelyra.xyz](https://try.getelyra.xyz)**

> *The multi-agentic orchestration layer that automates the full hedge fund lifecycle — from intelligence discovery to on-chain execution — and returns capital sovereignty to the individual.*

---

## The Thesis

Every structural advance in financial markets has followed the same pattern: an information asymmetry exists, someone builds infrastructure to collapse it, and capital flows toward whoever controls that infrastructure.

Bloomberg terminals collapsed information asymmetry in the 1980s. High-frequency trading collapsed execution latency in the 2000s. DeFi collapsed custody asymmetry in the 2020s.

**The next collapse is agentic.** The asymmetry that remains — the one no terminal, bot, or dashboard has closed — is cognitive coordination: the ability to simultaneously process whale flows, funding rates, social sentiment, on-chain risk, macro signals, and derivatives data, and resolve all of it into a single, high-conviction decision in milliseconds, continuously, without fatigue or emotional anchoring.

Elyra is that infrastructure. It replaces the "50-analyst model" with 50 autonomous agents operating in permanent session — competing, cross-validating, and executing within hard risk boundaries. A trade does not fire until the evidence genuinely converges.

---

## The Problem: Fragmented Intelligence, Not Fragmented Tools

The crypto market infrastructure problem is not a tooling problem. It is a coordination problem.

A serious participant on any given session must simultaneously monitor price action and volume across CEXs and DEXs, read on-chain smart-money flows before they move, verify contract integrity and holder concentration risk, track funding rates and open interest on perpetuals, gauge cross-platform social sentiment, evaluate DeFi yield relative to volatility-adjusted opportunity cost, and execute across spot, leverage, and liquidity positions — often in parallel.

That is not a trading workflow. That is ten analytically distinct jobs running inside one person's working memory. Every transition between a Telegram alert and a wallet interface is a context-switch that compounds latency, introduces bias, and erodes the edge.

Three structural failure modes define the current state of the market:

**The Fragmentation Tax.** The trader becomes the manual integration layer between socials, swaps, on-chain data, and execution venues. Every insight discovered in one silo must be manually re-contextualized in another. The cognitive overhead is not a friction cost — it is the primary source of alpha decay.

**The Temporal Ceiling.** Individual returns are fundamentally bounded by the number of hours a human can sustain analytical focus. Copy-trading and rule-based bots do not solve this — they automate the replication of manual errors and inherit execution lag. The ceiling does not rise. It just gets louder.

**The Institutional Blackbox.** At scale, the problem compounds. Forensic analysis of 2026 private credit markets reveals a 15% default rate among U.S. borrowers — information buried across thousands of SEC EDGAR filings and UCC registrations that no individual analyst can synthesize in real time. PE firms using PIK structures and NAV-leverage stacking create layered liability that legacy monitoring systems cannot surface. Hidden risk does not dissipate. It accumulates until it does not.

**The real problem is structural:** there exists no system today in which multiple independent intelligence layers simultaneously compete to reach a trading decision, each weighting distinct signal categories, each required to justify a thesis, with execution gated behind genuine evidence convergence. Markets are won by whoever resolves disagreement fastest. That infrastructure does not exist yet.

---

## The Solution: A 50-Agent Hedge Fund, Not a Faster Bot

Elyra is not a trading bot. The distinction is architectural, not semantic.

Telegram bots are transaction accelerators — they compress the time between a human decision and an on-chain execution. Elyra replaces the human decision loop entirely with a multi-agent system that comprehends intent, models context, and executes complete investment workflows across research, strategy formation, order routing, and post-trade attribution.

The system currently processes **10+ live protocols** with **150+ in the integration pipeline**, pulls real-time data from **10+ exchanges** (Binance, OKX, Kraken, Gate, Hyperliquid, Jupiter), and orchestrates across **six frontier model providers** (Claude, KIMI, Qwen, Grok, Gemini, GPT) — not to replicate capability, but to ensemble disagreement and extract the signal that survives cross-model scrutiny.

The agent swarm operates on a constrained autonomy model:

- **Low-noise signal filtration first.** Agents scan continuously, discarding high-volatility noise before any analysis begins. Only structurally clean setups surface to the next layer.
- **Multi-layer validation before any trigger fires.** Filtered targets undergo deep technical analysis across 200+ indicators, on-chain confirmation, and sentiment cross-referencing. No single-source conviction is sufficient.
- **Hard portfolio exposure caps.** Position sizing is computed against live portfolio state. A 5% maximum exposure ceiling is enforced programmatically — it cannot be overridden by agent confidence scores.
- **Human-in-the-loop on every consequential action.** Less than 5% of portfolio exposure is given to autonomous execution. Everything else passes through explicit user confirmation, with full preview before commitment.

**A concrete illustration of cross-source synthesis:** When Iran-Israel escalation signals appear in news feeds, Elyra does not simply flag geopolitical risk. It simultaneously evaluates existing open positions, live funding rates on relevant perpetuals, current portfolio P&L exposure, and historical price behavior during comparable macro events — then computes whether to enter, at what size, and at what exit threshold. When SOL is priced at $80.15 on Binance and $80.30 on Jupiter, Elyra routes to the better fill without instruction. Every basis point is governed.

---

## The DSEA Engine: Four Layers, One System

The operational core of Elyra is the **DSEA Engine** — a four-phase loop that converts raw market state into attributed on-chain outcomes.

**Discovery.** Elyra maintains permanent surveillance across whale transfer flows, liquidity position shifts, social sentiment velocity, funding rate anomalies, and macro indicators. It does not alert on data — it surfaces what matters, eliminating the tab-switching that defines the current trader experience.

**Strategy.** The user defines the rules of engagement: asset universe, maximum exposure, drawdown tolerance, entry and exit conditions. Within those parameters, Elyra operates with identical discipline at 3 AM during a volatility spike as it does during normal market hours. It does not fatigue, anchor to prior positions, or deviate under pressure.

**Execution.** Order routing is optimized for outcome, not convenience. Spot aggregation runs through Jupiter. Perpetuals route to HyperLiquid (229 markets, up to 50x leverage) or Elyra Perps (20 markets, up to 150x). Prediction market positions execute via Polymarket and DFlow. Venue selection, slippage minimization, and partial-fill handling are governed — not delegated to the user.

**Attribution.** Every action generates a permanent, traceable record: what was executed, what signal triggered it, what it cost, and what the outcome was. Most systems are opaque post-execution. Elyra's attribution layer closes that gap, enabling strategy refinement that compounds over time.

Each user receives a dedicated cloud trading environment running this loop continuously:

```
Define Parameters → 24/7 Surveillance → Condition Triggered → HIL Review
→ Strategy Executed → On-chain Settlement → TP/SL Armed
→ Alert Delivered → Capital Compounds While You Sleep
```

---

## Product Surface: Seven Modules, One Interface

Elyra compresses the entire crypto stack into a single conversational interface — natural language in, on-chain outcomes out. No new UI to learn. No dashboards to manage. Intent expressed, workflow executed.

```
SCAN    Market Intelligence
        Real-time price · market cap · 200+ technical indicators
        On-chain smart-money flows · DEX prints · pump.fun signals
        Funding rates · open interest · liquidation heatmaps
        Fear & Greed · Altseason index · CT pulse · Allora AI consensus

EXECUTE Order Flow
        Solana spot via Jupiter aggregation (best-price routing)
        Elyra Perps — 20 markets · up to 150x leverage
        HyperLiquid — 229 markets · up to 50x leverage
        Market · limit · conditional · TP/SL attached orders
        Cross-chain bridging: SOL + 6 EVM networks

YIELD   On-chain Capital Deployment
        Kamino: supply · borrow · loop strategies
        Meteora: AMM + DLMM concentrated liquidity positions
        Sanctum: LST stacking with live APY comparison
        Live yield scan with protocol risk filter

ODDS    Prediction Markets
        Polymarket: event lines + real-time mispricing scanner
        DFlow: Solana-native orderbooks + taker flow analysis
        Cross-book line shopping and structural arbitrage

AUTO    Autonomous Operations
        Level-break alerts with immediate notification
        Daily PnL briefings with performance attribution
        24/7 TP/SL position monitoring
        Set-and-forget conditional exit management

SHADOW  Private Credit Intelligence
        SEC EDGAR and UCC filing ingestion pipeline
        Rolling True Default Rate computation
        Fund-specific Systemic Risk Score
        Hidden debt graph reconstruction

OUTPUT  Reporting & Analytics
        Charts: candlestick · funding rate · liquidation heatmap · volume profile
        PnL recaps: daily · weekly · monthly with win rate and avg R:R
        Trade journal with full decision trace
        Export: XLSX · PDF · shareable link
```

### Product-Level Deep Dives

**Market Analysis.** Any token, any chain. Elyra cross-references Birdeye, CoinGecko, CoinMarketCap, Rugcheck, and Alternative.me simultaneously, returning a unified intelligence summary: real-time price, holder concentration, contract audit results, liquidity depth, and social sentiment — not a feed aggregation, but a synthesized assessment with a defensibility score.

```
Trader: "Full research on JUP"
Elyra:  "Jupiter (JUP) — $1.24 · +8.3% (24h) · Mkt Cap $1.67B (#42)
         Volume $285M · Safety 92/100 · Top-10 holders: 18% of supply
         No mint authority detected · LP locked
         Conviction: Structurally clean. Low counterparty risk."
```

**Chart Interpretation.** Multimodal input. Send any screenshot — from TradingView, Binance, or any CEX — and receive pattern classification, indicator readings (RSI, MACD, Bollinger, moving averages), key level identification, and a directional thesis with explicit invalidation conditions.

```
Trader: [SOL/USDT 4H screenshot]
Elyra:  "Bull flag forming in the $67,500–$69,200 range post-breakout.
         RSI 58 — neutral with upside room. MACD bullish cross 8h ago.
         Support: $66,500 / $64,000. Resistance: $69,200 / $71,500.
         Thesis: Continuation. Invalidated below $66,500."
```

**Perpetuals Management.** Full lifecycle — deposit, transfer to sub-account, open, monitor, and close — through natural language. No manual sub-account configuration. Auto-provisioned on first order.

```
Trader: "Open 10x long SOL, 1 SOL notional"
Elyra:  "SOLUSDT BUY MARKET 1 @ 10x · Entry $80 · Margin required $8"

Trader: "Show my positions"
Elyra:  "SOLUSDT LONG · 1 SOL · Entry $80 · Mark $82.25 · PnL +$22.50"

Trader: "Close SOL"
Elyra:  "SELL MARKET 1 SOLUSDT · Exit $82.25 · Realized PnL +$22.50"
```

**DeFi Execution.** Kamino (lending/borrowing/looping), Meteora (AMM + DLMM liquidity provision), Sanctum (LST yield comparison), Raydium, Pendle (Ethereum yield markets), and Drift — all operable from a single interface with preview-before-execute on every protocol interaction.

**Portfolio Intelligence.** Cross-venue aggregation: wallet holdings, perpetuals equity and margin utilization, and DeFi positions (deposits, borrows, LP value, accrued fees) — unified into one live view on demand.

```
Trader: "Portfolio summary"
Elyra:  "Wallet $14,280 (42.5 SOL · 3,500 USDC · 2,100 JUP · ...)
         Perps: Equity $5,200 · Available $3,800 · Margin used $1,400
         DeFi: Kamino $1,000 USDC deposited (8.2% APY) · Health 2.8
         Total: $20,725"
```

---

## Technical Architecture & Moat

**Secure Execution via TEEs.** Strategy logic runs inside Trusted Execution Environments — isolated, encrypted containers where agents handle private keys and execute confidential workflows without centralized custody or oversight. This is not a convenience feature. It is the trust model that makes autonomous execution viable at scale.

**Privy HSM Key Custody.** Private keys are managed through Hardware Security Module custody via Privy — not stored in embedded wallets, not exposed to application-layer logic, not accessible to Elyra's own infrastructure. Users retain cryptographic sovereignty.

**Programmable Agent Coordination via OpenClaw.** The OpenClaw Coordination Layer governs agent swarm behavior: agents negotiate execution terms, form coalitions on correlated signals, and retain veto authority over positions that violate cross-agent consensus thresholds. This is not a rule-based bot. It is a deliberative system.

**Eight Operational Domains of the Sovereign Capital Stack:**

| Domain | What It Governs |
|---|---|
| Execution Quality | Routing logic, latency optimization, fill quality, partial fills, cancel-replace |
| Risk Controls | Hard exposure limits, circuit breakers, TTLs, fat-finger protection, stale-price guards |
| Post-Trade Ledger | Real-time reconciliation, PnL attribution, automated tax-lot management |
| Data Infrastructure | Clean historical feeds, survivorship-bias handling, event stream, feature pipeline |
| Strategy Verification | Walk-forward testing, live-paper parity, slippage modeling, regime sensitivity |
| Reliability | Monitoring, alerting, graceful degradation, full replay capability |
| Compliance & Permissions | Key management, withdrawal controls, RBAC, audit logs, approvals |
| Network Effects | Aggregated flow insights, shared alpha signals, strategy marketplace |

**The Intelligence Stack — Seven Verticals:**

1. **Research** — SEC/EDGAR and UCC filing ingestion, rolling True Default Rate oracle, fund-level Systemic Risk Score
2. **DeFi** — Kamino, Meteora, Sanctum, Raydium, Pendle, Drift
3. **Trading** — Spot and perpetuals across Jupiter, HyperLiquid, and CEX aggregation
4. **Prediction Markets** — Polymarket mispricing scanner, DFlow taker flow analysis
5. **Social Intelligence** — X, Telegram, and news sentiment with narrative velocity tracking
6. **Derivatives** — Funding rates, open interest, liquidation heatmaps, Deribit options data
7. **OpenClaw Coordination** — Agent swarm orchestration, coalition logic, veto governance

---

## The Shadow Map Agent: Dismantling Institutional Information Asymmetry

Elyra's third product line targets a distinct asymmetry: the $1.7T+ private credit market, where risk is systematically obscured inside unstructured regulatory filings.

Forensic analysis of 2026 data reveals a 15% default rate among U.S. private credit borrowers — a signal invisible to most institutional monitors because it requires cross-referencing thousands of SEC EDGAR filings and UCC registrations simultaneously. PE funds deploying PIK structures and NAV-leverage stacking have created compounding liability that no traditional risk model surfaces in advance. The information exists. The infrastructure to synthesize it in real time does not.

The Shadow Map Agent closes that gap:

- **Data Ingestion Layer.** Autonomous quarterly scraping of SEC EDGAR filings and UCC registrations, reconstructing hidden debt obligation graphs and beneficial ownership stacks at fund level.
- **Intelligence Layer.** Rolling computation of a "True Default Rate" — adjusted for PIK deferrals and NAV-leverage distortion — and a fund-specific "Systemic Risk Score" that functions as a real-time credit oracle. Legacy firms cannot replicate this at speed or scale.

This is not a reporting tool. It is an early-warning system for capital exposed to private credit deterioration, delivered before the market prices in the risk.

---

## Validation & Traction

**Academic Recognition.** Elyra's core thesis was formally presented at the ICIDSSD Conference, earning **Best Paper recognition out of 450+ submissions** across thousands of participants. The award reflects external validation of the architectural thesis, not just product execution. [Announcement →](https://x.com/getelyra/status/2047774633659908185?s=20)

**Empirical Benchmarking.** The system has been tested across 4 chains and 10 live applications, with results published in two structured data sets:
- [AI agent performance benchmarks: open-source vs. frontier models](https://docs.google.com/spreadsheets/d/13gBrHr7OML7Sv7qiXteRRO8jaOQU1EWwnaWS_F3cTq8/edit?usp=sharing)
- [Issue tracker across 10 live agent deployments](https://docs.google.com/spreadsheets/d/1GFtt2JpdHPzhGGXyEKoa2GHiK1sDSPKi5W8W7XUPsR4/edit?usp=sharing)

The benchmarking process informed the ensemble model architecture — the specific failure modes of individual frontier models under adversarial market conditions are the basis for the cross-model validation layer.

---

## Why Now: The Convergence Window

Three conditions have converged simultaneously for the first time:

**Multimodal LLM maturity.** Models now perceive charts, parse unstructured financial filings, interpret social data, and generate and execute code within a single context window. The capability gap that made agentic trading systems theoretically sound but practically unworkable has closed.

**MCP and agent orchestration primitives.** Model Context Protocol integration means agents can now reason, call live endpoints, execute transactions, and retain operational memory in a coherent loop — not as isolated model calls, but as persistent, stateful workflows.

**Solana's infrastructure advantage.** Ethereum holds 8x more TVL. Solana captures 26% of global DEX volume — $1.39B in the last 24 hours — at sub-cent fees with sub-400ms finality. This is not a preference argument. It is a throughput argument. High-frequency autonomous trading agents require execution rails that can keep pace with agent decision velocity. No other chain provides that today. The problem: most capital remains locked on slow, high-slippage legacy chains. Elyra's routing layer bridges that gap, directing agent execution to Solana's velocity while maintaining cross-chain access.

The window in which this infrastructure can be built and establish network effects before incumbents replicate it is not indefinite. It is now.

---

## Competitive Differentiation

The relevant comparison set is not other trading bots. It is the infrastructure layer that will govern how autonomous capital operates across the next market cycle.

| Dimension | Telegram Bots | Existing Copilots | Elyra |
|---|---|---|---|
| Interface | Button menus | Dashboard UI | Agentic natural language |
| Decision model | Rule-based execution | Single-model inference | Multi-agent deliberation with cross-validation |
| Perpetuals | Spot swaps only | Limited | Full lifecycle — Jupiter + HyperLiquid |
| Prediction markets | None | None | Polymarket + DFlow with mispricing scanner |
| Signal synthesis | Price feeds | Price + basic TA | On-chain + derivatives + social + macro + news |
| Execution routing | Single venue | Single venue | AI-routed, best-fill, multi-venue |
| Key custody | Embedded wallet | Embedded wallet | Privy HSM |
| Autonomy model | Fully manual | Human-in-loop | Constrained autonomy with hard exposure caps |
| Institutional layer | None | None | SEC/EDGAR UCC filings, private credit risk oracle |
| Post-trade attribution | None | Partial | Full decision trace per action |

---

## The Addressable Moment

The architecture of money is integrated. The experience of deploying it is fractured. Every serious participant today is manually bridging a dozen systems — not because better tools do not exist, but because no system has ever unified intelligence, execution, and attribution into a single, continuously operating layer.

Elyra does not compress the time between a decision and a trade. It eliminates the gap between a market condition and an outcome — running the full loop from signal to settlement, at any hour, inside user-defined risk parameters, with every action attributable and every basis point governed.

The individual with Elyra does not trade faster. They trade less — because the system is trading for them, better, all the time.

---

## Developer Reference

*The sections below are provided for technical due diligence and contributor onboarding.*

### Repository Layout

```text
.
|-- main.py                       # pipeline entrypoint
|-- run.py                        # thin wrapper
|-- agents/                       # market, quant, news, and on-chain agents
|-- collectors/                   # Binance, Helius, NewsData API clients
|-- analysis/                     # technical indicator calculations
|-- research/                     # report synthesis and fallback generation
|-- skills/trade_research/        # Polymarket analysis pipeline
|-- assets/                       # media and screenshots
|-- .env.example                  # environment variable template
|-- requirements.txt              # Python dependencies
`-- Elyra/                        # Next.js frontend (see Elyra/README.md)
```

### Backend Setup

Python 3.10+ required.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python3 main.py
```

### Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `HELIUS_API_KEY` | Solana on-chain whale activity | Optional |
| `NEWSDATA_API_KEY` | Crypto news and sentiment | Optional |
| `GEMINI_API_KEY` | AI-generated research reports | Optional |

Missing keys degrade gracefully — affected pipeline stages fall back to static output or are skipped. `GOOGLE_API_KEY` is accepted as an alias for `GEMINI_API_KEY`.

### Pipeline Execution

```bash
# Full pipeline (6 stages)
python3 main.py

# Polymarket only
python3 main.py polymarket
python3 main.py polymarket --json
python3 main.py polymarket --top 10 --max-markets 800

# Individual agents
python3 agents/market_agent.py
python3 agents/quant_agent.py ETHUSDT
python3 agents/onchain_agent.py <solana_wallet>
python3 agents/news_agent.py
python3 -m skills.trade_research.trade_research --top 5 --json
```

Polymarket semantic clustering uses `sentence-transformers` and falls back to TF-IDF if unavailable. First run may download a Hugging Face model to `.cache/huggingface/`.

### Frontend Setup

```bash
cd Elyra
npm install
cp .env.example .env.local
npm run dev
```

Runs at [http://localhost:3000](http://localhost:3000). Full environment variable documentation in [`Elyra/README.md`](Elyra/README.md).
