#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Bin verb implementation."""

from typing import Any

import numpy as np
import pandas as pd

from .decorators import (
    OutputMode,
    inputs,
    outputs,
    verb,
)
from .types import BinStrategy


def __get_bucket_value(
    bin_edges: np.ndarray,
    indices: np.ndarray,
    n: int,
    clamped: bool | None,
    min_max: tuple[int, int] | tuple[float, float],
    value: float,
    print_range: bool | None,
) -> Any:
    if value < min_max[0]:
        if print_range:
            return f"<{min_max[0]}"
        return -np.inf if not clamped else bin_edges[0]

    if value > min_max[1]:
        if print_range:
            return f">{int(min_max[1])}"
        return np.inf if not clamped else bin_edges[-2]

    if value == bin_edges[-1]:
        if print_range:
            return f"{int(bin_edges[-2])} to {min_max[1]}"
        return bin_edges[-2]

    index = min(indices[n] - 1, len(bin_edges) - 1)
    if print_range:
        return (
            f"{int(bin_edges[index])} to {min_max[1]}"
            if len(bin_edges) - 1 == index + 1
            else f"{int(bin_edges[index])} to <{int(bin_edges[index+1])}"
        )
    return bin_edges[index]


__bin_edges_mapping = {
    BinStrategy.Auto: lambda column, min_max: np.histogram_bin_edges(
        column, bins="auto", range=min_max
    ),
    BinStrategy.Fd: lambda column, min_max: np.histogram_bin_edges(
        column, bins="fd", range=min_max
    ),
    BinStrategy.Sturges: lambda column, min_max: np.histogram_bin_edges(
        column, bins="sturges", range=min_max
    ),
    BinStrategy.Doane: lambda column, min_max: np.histogram_bin_edges(
        column, bins="doane", range=min_max
    ),
    BinStrategy.Scott: lambda column, min_max: np.histogram_bin_edges(
        column, bins="scott", range=min_max
    ),
    BinStrategy.Rice: lambda column, min_max: np.histogram_bin_edges(
        column, bins="rice", range=min_max
    ),
    BinStrategy.Sqrt: lambda column, min_max: np.histogram_bin_edges(
        column, bins="sqrt", range=min_max
    ),
}


@verb(
    name="bin",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def bin(  # noqa A001 - use ds verb name
    table: pd.DataFrame,
    to: str,
    column: str,
    strategy: str,
    min: int | None = None,  # noqa: A002
    max: int | None = None,  # noqa: A002
    fixedcount: int | None = None,
    fixedwidth: int | None = None,
    clamped: bool | None = False,
    printRange: bool | None = False,  # noqa: N803
    **_kwargs: Any,
) -> pd.DataFrame:
    """Bin verb implementation."""
    bin_strategy = BinStrategy(strategy)
    min_max = (
        (min, max)
        if min is not None and max is not None
        else (np.min(table[column]), np.max(table[column]))
    )

    if bin_strategy == BinStrategy.FixedCount and fixedcount is not None:
        bin_edges = np.histogram_bin_edges(
            table[column], bins=fixedcount, range=min_max
        )
    elif bin_strategy == BinStrategy.FixedWidth:
        fixedwidth = fixedwidth if fixedwidth is not None else 0
        bin_edges = np.histogram_bin_edges(
            table[column],
            bins=np.arange(min_max[0], min_max[1] + fixedwidth, fixedwidth, dtype=int),
            range=min_max,
        )
    else:
        bin_edges = __bin_edges_mapping[bin_strategy](table[column], min_max)

    indices = np.digitize(table[column], bin_edges)
    value_edges = [
        __get_bucket_value(
            bin_edges,
            indices,
            n,
            clamped,
            min_max,
            table[column].iloc[n],
            printRange,
        )
        for n in range(len(table[column]))
    ]

    output = table
    output[to] = value_edges
    return output
