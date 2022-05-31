#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import numpy as np

from data_wrangling_components.table_store import TableContainer
from data_wrangling_components.types import BinStrategy


def __get_bucket_value(bin_edges, inds, n, clamped, min_max, value, printRange):
    if value < min_max[0]:
        if printRange:
            return f"<{min_max[0]}"
        return -np.inf if not clamped else int(bin_edges[0])
    elif value > min_max[1]:
        if printRange:
            return f">{int(min_max[1])}"
        return np.inf if not clamped else int(bin_edges[-2])
    elif value == bin_edges[-1]:
        if printRange:
            return f"{int(bin_edges[-2])} to {min_max[1]}"
        return int(bin_edges[-2])
    index = min(inds[n] - 1, len(bin_edges) - 1)
    if printRange:
        return (
            f"{int(bin_edges[index])} to {min_max[1]}"
            if len(bin_edges) - 1 == index + 1
            else f"{int(bin_edges[index])} to <{int(bin_edges[index+1])}"
        )
    return bin_edges[index]


def bin(
    input: TableContainer,
    to: str,
    column: str,
    strategy: str,
    fixedcount: int = None,
    fixedwidth: int = None,
    min: int = None,
    max: int = None,
    clamped: bool = False,
    printRange: bool = False,
):
    """Executes a bin aggregate.

    Effectively truncates values to a bin boundary for histograms.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.bin.BinArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    input_table = input.table
    bin_strategy = BinStrategy(strategy)
    min_max = (
        (min, max)
        if min is not None and max is not None
        else (np.min(input_table[column]), np.max(input_table[column]))
    )

    if bin_strategy == BinStrategy.Auto:
        bin_edges = np.histogram_bin_edges(
            input_table[column], bins="auto", range=min_max
        )
    elif bin_strategy == BinStrategy.FixedCount and fixedcount is not None:
        bin_edges = np.histogram_bin_edges(
            input_table[column], bins=fixedcount, range=min_max
        )
    elif bin_strategy == BinStrategy.FixedWidth:
        bin_edges = np.histogram_bin_edges(
            input_table[column],
            bins=np.arange(min_max[0], min_max[1] + fixedwidth, fixedwidth, dtype=int),
            range=min_max,
        )

    inds = np.digitize(input_table[column], bin_edges)
    value_edges = [
        __get_bucket_value(
            bin_edges,
            inds,
            n,
            clamped,
            min_max,
            input_table[column].iloc[n],
            printRange,
        )
        for n in range(len(input_table[column]))
    ]

    output = input_table.copy()
    output[to] = value_edges
    return TableContainer(table=output)
