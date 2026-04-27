from __future__ import annotations

import random
from typing import Any

from analysis.pure_indicators import (
    ema_series,
    extract_closes,
    macd_dict,
    wilder_rsi_series,
)


def calculate_rsi(
    data: Any,
    period: int = 14,
) -> list[float | None]:
    """Wilder RSI; returns a list (same length as closes), leading values None."""
    closes = extract_closes(data)
    return wilder_rsi_series(closes, period)


def calculate_ema(
    data: Any,
    period: int = 20,
) -> list[float | None]:
    closes = extract_closes(data)
    return ema_series(closes, period)


def calculate_macd(
    data: Any,
    fast_period: int = 12,
    slow_period: int = 26,
    signal_period: int = 9,
) -> dict[str, list[float | None]]:
    closes = extract_closes(data)
    return macd_dict(
        closes,
        fast_period=fast_period,
        slow_period=slow_period,
        signal_period=signal_period,
    )


if __name__ == "__main__":
    random.seed(42)
    n = 100
    close: list[float] = [100.0]
    for _ in range(n - 1):
        close.append(close[-1] + random.gauss(0, 0.5))
    sample: list[dict[str, float]] = []
    for i in range(n):
        c = close[i]
        wobble = abs(random.gauss(0, 0.2))
        sample.append(
            {
                "open": c - 0.5,
                "high": c + wobble,
                "low": c - wobble,
                "close": c,
            }
        )

    print("Sample OHLC (last 5 rows):")
    for row in sample[-5:]:
        print(row)
    print()

    rsi = calculate_rsi(sample)
    print(f"RSI (last 5): {rsi[-5:]}")
    print()

    ema = calculate_ema(sample, period=20)
    print(f"EMA(20) (last 5): {ema[-5:]}")
    print()

    macd = calculate_macd(sample)
    print("MACD (last 5) macd_line:", macd["macd_line"][-5:])
