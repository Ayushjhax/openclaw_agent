"""
RSI (Wilder), EMA, and MACD using only the Python standard library.
Removes the hard dependency on pandas / ta for core indicator math.
"""

from __future__ import annotations

from typing import Any


def ema_series(closes: list[float], period: int) -> list[float | None]:
    n = len(closes)
    out: list[float | None] = [None] * n
    if n < period:
        return out
    k = 2.0 / (period + 1)
    ema = sum(closes[:period]) / period
    out[period - 1] = ema
    for i in range(period, n):
        ema = closes[i] * k + ema * (1.0 - k)
        out[i] = ema
    return out


def _rs_from_averages(avg_gain: float, avg_loss: float) -> float:
    if avg_loss == 0.0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100.0 - (100.0 / (1.0 + rs))


def wilder_rsi_series(closes: list[float], period: int) -> list[float | None]:
    n = len(closes)
    out: list[float | None] = [None] * n
    if n < period + 1:
        return out
    gains: list[float] = []
    losses: list[float] = []
    for i in range(1, n):
        d = closes[i] - closes[i - 1]
        gains.append(d if d > 0.0 else 0.0)
        losses.append(-d if d < 0.0 else 0.0)
    m = len(gains)
    ag = sum(gains[:period]) / period
    al = sum(losses[:period]) / period
    for i in range(period, m):
        ag = (ag * (period - 1) + gains[i]) / period
        al = (al * (period - 1) + losses[i]) / period
        out[i + 1] = _rs_from_averages(ag, al)
    return out


def macd_dict(
    closes: list[float],
    fast_period: int = 12,
    slow_period: int = 26,
    signal_period: int = 9,
) -> dict[str, list[float | None]]:
    e_fast = ema_series(closes, fast_period)
    e_slow = ema_series(closes, slow_period)
    n = len(closes)
    macd_line: list[float | None] = [None] * n
    for i in range(n):
        a, b = e_fast[i], e_slow[i]
        if a is not None and b is not None:
            macd_line[i] = a - b
    dense_values = [v for v in macd_line if v is not None]
    if not dense_values:
        return {
            "macd_line": macd_line,
            "macd_signal": [None] * n,
            "macd_histogram": [None] * n,
        }
    sig_d = ema_series(dense_values, signal_period)
    macd_signal: list[float | None] = [None] * n
    j = 0
    for i in range(n):
        if macd_line[i] is None:
            continue
        if j < len(sig_d):
            macd_signal[i] = sig_d[j]
        j += 1
    hist: list[float | None] = [None] * n
    for i in range(n):
        m, s = macd_line[i], macd_signal[i]
        if m is not None and s is not None:
            hist[i] = m - s
    return {
        "macd_line": macd_line,
        "macd_signal": macd_signal,
        "macd_histogram": hist,
    }


def extract_closes(data: Any) -> list[float]:
    if isinstance(data, list) and data and isinstance(data[0], dict):
        return [float(x["close"]) for x in data]
    if isinstance(data, dict) and "close" in data and isinstance(data["close"], list):
        return [float(x) for x in data["close"]]
    try:
        import pandas as pd

        if isinstance(data, pd.DataFrame):
            df = data.copy()
            df.columns = [str(c).lower() for c in df.columns]
            if "close" not in df.columns:
                raise ValueError("DataFrame must include a 'close' column")
            return [float(x) for x in df["close"].tolist()]
    except ImportError:
        pass
    raise TypeError("data must be a list[dict] with 'close', dict of columns, or pandas DataFrame")
