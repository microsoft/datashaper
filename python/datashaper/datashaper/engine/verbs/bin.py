#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Optional, cast

import numpy as np
import pandas as pd

from datashaper.engine.types import BinStrategy
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


def __get_bucket_value(
    bin_edges,
    indices,
    n: int,
    clamped: bool | None,
    min_max,
    value,
    printRange: bool | None,
):
    if value < min_max[0]:
        if printRange:
            return f"<{min_max[0]}"
        return -np.inf if not clamped else bin_edges[0]
    elif value > min_max[1]:
        if printRange:
            return f">{int(min_max[1])}"
        return np.inf if not clamped else bin_edges[-2]
    elif value == bin_edges[-1]:
        if printRange:
            return f"{int(bin_edges[-2])} to {min_max[1]}"
        return bin_edges[-2]
    index = min(indices[n] - 1, len(bin_edges) - 1)
    if printRange:
        return (
            f"{int(bin_edges[index])} to {min_max[1]}"
            if len(bin_edges) - 1 == index + 1
            else f"{int(bin_edges[index])} to <{int(bin_edges[index+1])}"
        )
    return bin_edges[index]


__bin_edges_mapping = {
    BinStrategy.Auto: lambda column, range: np.histogram_bin_edges(
        column, bins="auto", range=range
    ),
    BinStrategy.Fd: lambda column, range: np.histogram_bin_edges(
        column, bins="fd", range=range
    ),
    BinStrategy.Sturges: lambda column, range: np.histogram_bin_edges(
        column, bins="sturges", range=range
    ),
    BinStrategy.Doane: lambda column, range: np.histogram_bin_edges(
        column, bins="doane", range=range
    ),
    BinStrategy.Scott: lambda column, range: np.histogram_bin_edges(
        column, bins="scott", range=range
    ),
    BinStrategy.Rice: lambda column, range: np.histogram_bin_edges(
        column, bins="rice", range=range
    ),
    BinStrategy.Sqrt: lambda column, range: np.histogram_bin_edges(
        column, bins="sqrt", range=range
    ),
}


@verb(name="bin")
def bin(
    input: VerbInput,
    to: str,
    column: str,
    strategy: str,
    min: Optional[int] = None,
    max: Optional[int] = None,
    fixedcount: Optional[int] = None,
    fixedwidth: Optional[int] = None,
    clamped: Optional[bool] = False,
    printRange: Optional[bool] = False,
):
    input_table = cast(pd.DataFrame, input.get_input())
    bin_strategy = BinStrategy(strategy)
    min_max = (
        (min, max)
        if min is not None and max is not None
        else (np.min(input_table[column]), np.max(input_table[column]))
    )

    if bin_strategy == BinStrategy.FixedCount and fixedcount is not None:
        bin_edges = np.histogram_bin_edges(
            input_table[column], bins=fixedcount, range=min_max
        )
    elif bin_strategy == BinStrategy.FixedWidth:
        fixedwidth = fixedwidth if fixedwidth is not None else 0
        bin_edges = np.histogram_bin_edges(
            input_table[column],
            bins=np.arange(min_max[0], min_max[1] + fixedwidth, fixedwidth, dtype=int),
            range=min_max,
        )
    else:
        bin_edges = __bin_edges_mapping[bin_strategy](input_table[column], min_max)

    indices = np.digitize(input_table[column], bin_edges)
    value_edges = [
        __get_bucket_value(
            bin_edges,
            indices,
            n,
            clamped,
            min_max,
            input_table[column].iloc[n],
            printRange,
        )
        for n in range(len(input_table[column]))
    ]

    output = input_table
    output[to] = value_edges
    return TableContainer(table=output)
