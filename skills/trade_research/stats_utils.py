"""Small stats helpers so trade_research runs without numpy."""

from __future__ import annotations

import math
from typing import Sequence


def mean(values: Sequence[float]) -> float:
    if not values:
        return 0.0
    return float(sum(values)) / len(values)


def percentile(values: Sequence[float], p: float) -> float:
    if not values:
        return 0.0
    s = sorted(float(x) for x in values)
    if len(s) == 1:
        return s[0]
    k = (len(s) - 1) * (p / 100.0)
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return s[int(k)]
    return s[f] * (c - k) + s[c] * (k - f)


def log1p(x: float) -> float:
    return math.log1p(max(x, 0.0))
