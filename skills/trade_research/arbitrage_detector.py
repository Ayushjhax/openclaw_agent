import logging
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class ArbitrageOpportunity:
    arb_type: str
    market_ids: list[str]
    questions: list[str]
    total_probability: float
    profit_potential: float
    details: str


def detect_arbitrage(
    markets: list,
    _clusters: list,
    same_market_threshold: float = 1.01,
    _contradicting_threshold: float = 1.05,
) -> list[ArbitrageOpportunity]:
    # `_clusters` kept for call-site compatibility. Summing YES across a large "similar topic"
    # cluster mixes mutually exclusive outcomes and is not a valid arb signal.
    opportunities = []
    for m in markets:
        total = m.yes_price + m.no_price
        if total >= same_market_threshold:
            profit = (total - 1.0) * 100
            opportunities.append(
                ArbitrageOpportunity(
                    arb_type="same_market",
                    market_ids=[m.id],
                    questions=[m.question[:60] + "..." if len(m.question) > 60 else m.question],
                    total_probability=total,
                    profit_potential=profit,
                    details=f"YES={m.yes_price:.2f} + NO={m.no_price:.2f} = {total:.2f}",
                )
            )

    logger.info(f"Detected {len(opportunities)} arbitrage opportunities")
    return opportunities
