from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from analysis.indicators import calculate_ema, calculate_rsi


def _last_value(series: list[float | None], default: float) -> float:
    for x in reversed(series):
        if x is not None:
            return float(x)
    return default


def _derive_signal(rsi: float, trend: str) -> str:
    if rsi >= 70:
        return "overbought"
    if rsi <= 30:
        return "oversold"
    if trend == "bullish" and 50 < rsi < 70:
        return "possible breakout"
    if trend == "bearish" and 30 < rsi < 50:
        return "possible breakdown"
    if trend == "bullish":
        return "uptrend"
    return "downtrend"


def analyze_market(
    symbol: str = "BTCUSDT",
    interval: str = "1d",
    limit: int = 100,
    rsi_period: int = 14,
    ema_period: int = 20,
) -> dict[str, str | int]:
    from collectors.binance import get_klines

    ohlc = get_klines(symbol=symbol, interval=interval, limit=limit)

    if len(ohlc) < max(rsi_period, ema_period) + 1:
        return {
            "trend": "neutral",
            "rsi": 50,
            "signal": "insufficient data",
        }

    rsi_series = calculate_rsi(ohlc, period=rsi_period)
    ema_series = calculate_ema(ohlc, period=ema_period)
    last_close = float(ohlc[-1]["close"])
    last_ema = _last_value(ema_series, last_close)
    last_rsi = _last_value(rsi_series, 50.0)
    trend = "bullish" if last_close >= last_ema else "bearish"
    rsi_int = int(round(last_rsi))
    signal = _derive_signal(last_rsi, trend)

    return {
        "trend": trend,
        "rsi": rsi_int,
        "signal": signal,
    }


if __name__ == "__main__":
    import json

    symbol = sys.argv[1] if len(sys.argv) > 1 else "BTCUSDT"
    result = analyze_market(symbol=symbol)
    print(json.dumps(result, indent=2))
