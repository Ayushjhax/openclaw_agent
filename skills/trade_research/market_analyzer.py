import logging
import math
from typing import Any

from skills.trade_research.polymarket_client import (
    Polymarket,
    fetch_all_markets,
    market_event_url,
)
from skills.trade_research.market_clusterer import cluster_markets
from skills.trade_research.opportunity_detector import detect_opportunities, Opportunity
from skills.trade_research.arbitrage_detector import detect_arbitrage, ArbitrageOpportunity

logger = logging.getLogger(__name__)


def _activity_score(m: Polymarket) -> float:
    return math.log1p(m.liquidity) * math.log1p(m.volume)


def _rank_opportunities(
    opportunities: list[Opportunity],
    market_by_id: dict[str, Polymarket],
    top_n: int,
) -> list[dict]:
    sorted_opps = sorted(
        opportunities,
        key=lambda o: o.score_component,
        reverse=True,
    )
    top = sorted_opps[:top_n]
    rows = []
    for i, o in enumerate(top):
        m = market_by_id.get(o.market_id)
        url = market_event_url(m) if m else None
        rows.append(
            {
                "rank": i + 1,
                "market_id": o.market_id,
                "question": o.question,
                "yes_price": o.yes_price,
                "no_price": o.no_price,
                "liquidity": o.liquidity,
                "volume": o.volume,
                "reason": o.reason,
                "score": round(o.score_component, 4),
                "url": url,
            }
        )
    return rows


def _merge_trading_rows(
    existing: list[dict],
    markets: list[Polymarket],
    market_by_id: dict[str, Polymarket],
    top_n: int,
) -> list[dict]:
    """Keep ranked detector rows, then top up with high-activity markets (deduped)."""
    if len(existing) >= top_n:
        return existing[:top_n]
    seen = {r["market_id"] for r in existing}
    out = list(existing)
    sorted_by_activity = sorted(markets, key=_activity_score, reverse=True)
    next_rank = len(out) + 1
    for m in sorted_by_activity:
        if m.id in seen:
            continue
        out.append(
            {
                "rank": next_rank,
                "market_id": m.id,
                "question": m.question[:80] + "..." if len(m.question) > 80 else m.question,
                "yes_price": m.yes_price,
                "no_price": m.no_price,
                "liquidity": m.liquidity,
                "volume": m.volume,
                "reason": "high_liquidity_volume (activity)",
                "score": 0.0,
                "url": market_event_url(m),
            }
        )
        seen.add(m.id)
        next_rank += 1
        if len(out) >= top_n:
            break
    # Renumber ranks
    for i, row in enumerate(out[:top_n]):
        row["rank"] = i + 1
    return out[:top_n]


def _serialize_arbitrage(arbs: list[ArbitrageOpportunity], market_by_id: dict[str, Polymarket]) -> list[dict]:
    rows = []
    for a in arbs:
        url = None
        if len(a.market_ids) == 1:
            m = market_by_id.get(a.market_ids[0])
            if m:
                url = market_event_url(m)
        rows.append(
            {
                "type": a.arb_type,
                "market_ids": a.market_ids,
                "questions": a.questions,
                "total_probability": round(a.total_probability, 3),
                "profit_potential_pct": round(a.profit_potential, 2),
                "details": a.details,
                "url": url,
            }
        )
    return rows


def _ensure_arbitrage_rows(
    serialized: list[dict],
    markets: list[Polymarket],
    market_by_id: dict[str, Polymarket],
    min_n: int,
) -> list[dict]:
    """If few structural arbs exist, add watchlist rows so the UI always has signal."""

    def _renumber(rows: list[dict]) -> list[dict]:
        for i, row in enumerate(rows):
            row["rank"] = i + 1
        return rows

    combined = list(serialized)
    used_single: set[str] = set()
    for r in combined:
        mids = r.get("market_ids") or []
        if len(mids) == 1:
            used_single.add(mids[0])

    if len(combined) >= min_n:
        return _renumber(combined[:min_n])

    extras: list[dict] = []

    # Softer same-market threshold (still > 1)
    for m in markets:
        if m.id in used_single:
            continue
        t = m.yes_price + m.no_price
        if t >= 1.005:
            profit = (t - 1.0) * 100
            extras.append(
                {
                    "type": "same_market_relaxed",
                    "market_ids": [m.id],
                    "questions": [m.question[:60] + "..." if len(m.question) > 60 else m.question],
                    "total_probability": round(t, 4),
                    "profit_potential_pct": round(profit, 2),
                    "details": f"YES+NO={t:.4f} (relaxed threshold; verify book before trading)",
                    "url": market_event_url(m),
                }
            )
            used_single.add(m.id)

    extras.sort(key=lambda r: (-r["total_probability"], -(r.get("profit_potential_pct") or 0)))
    combined.extend(extras)

    if len(combined) >= min_n:
        return _renumber(combined[:min_n])

    # Price-sum deviation watchlist (microstructure; not a guaranteed arb). Include tiny
    # imbalances so we still surface rows when YES+NO rounds to 1.00 on the book.
    scored: list[tuple[float, Polymarket]] = []
    for m in markets:
        if m.id in used_single:
            continue
        t = m.yes_price + m.no_price
        dev = abs(t - 1.0)
        score = dev * math.log1p(m.liquidity + 1.0) + 1e-6 * _activity_score(m)
        scored.append((score, m))
    scored.sort(key=lambda x: -x[0])
    for _, m in scored:
        if m.id in used_single:
            continue
        t = m.yes_price + m.no_price
        dev = abs(t - 1.0)
        if dev < 1e-5:
            det = "YES+NO≈1.0; ranked by liquidity×volume (monitor order book / fees)"
        else:
            det = f"|YES+NO-1|={dev:.4f} watchlist (verify executable prices)"
        combined.append(
            {
                "type": "price_sum_deviation",
                "market_ids": [m.id],
                "questions": [m.question[:60] + "..." if len(m.question) > 60 else m.question],
                "total_probability": round(t, 4),
                "profit_potential_pct": 0.0,
                "details": det,
                "url": market_event_url(m),
            }
        )
        used_single.add(m.id)
        if len(combined) >= min_n:
            return _renumber(combined[:min_n])

    # Liquidity leaders as last resort
    for m in sorted(markets, key=_activity_score, reverse=True):
        if m.id in used_single:
            continue
        combined.append(
            {
                "type": "liquidity_leader",
                "market_ids": [m.id],
                "questions": [m.question[:60] + "..." if len(m.question) > 60 else m.question],
                "total_probability": round(m.yes_price + m.no_price, 4),
                "profit_potential_pct": 0.0,
                "details": "High liquidity × volume; no structural edge flagged",
                "url": market_event_url(m),
            }
        )
        used_single.add(m.id)
        if len(combined) >= min_n:
            break

    return _renumber(combined[:min_n])


def _serialize_mispriced(mispriced: list[dict]) -> list[dict]:
    return [
        {
            "market_id": m["market_id"],
            "question": m["question"],
            "yes_price": m["yes_price"],
            "cluster_mean_yes": m.get("cluster_mean_yes"),
            "mispricing": round(m["mispricing"], 3),
        }
        for m in mispriced
    ]


async def run_analysis(
    max_markets: int = 500,
    top_opportunities_n: int = 10,
) -> dict[str, Any]:
    logger.info("Starting Polymarket analysis...")
    markets = await fetch_all_markets(max_markets=max_markets, closed=False)
    if not markets:
        logger.warning("No markets returned from Polymarket Gamma API")
        return {
            "top_opportunities": [],
            "arbitrage": [],
            "mispriced_markets": [],
            "note": "Polymarket API returned no markets (network, API change, or filters).",
        }

    market_by_id = {m.id: m for m in markets}
    clusters = cluster_markets(markets, similarity_threshold=0.75, min_cluster_size=2)
    opportunities, mispriced = detect_opportunities(markets, clusters)
    arbs = detect_arbitrage(markets, clusters)

    top_opps = _rank_opportunities(opportunities, market_by_id, top_n=top_opportunities_n)
    top_opps = _merge_trading_rows(top_opps, markets, market_by_id, top_n=top_opportunities_n)

    arb_list = _serialize_arbitrage(arbs, market_by_id)
    arb_list = _ensure_arbitrage_rows(arb_list, markets, market_by_id, min_n=top_opportunities_n)

    mispriced_list = _serialize_mispriced(mispriced)

    return {
        "top_opportunities": top_opps,
        "arbitrage": arb_list,
        "mispriced_markets": mispriced_list,
    }
