#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Optional, Tuple, Union

import numpy as np

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import BinStrategy, OutputColumnArgs, Step


@dataclass
class BinArgs(OutputColumnArgs):
    column: str
    strategy: BinStrategy
    fixedcount: Optional[int] = None
    fixedwidth: Optional[int] = None
    min: Optional[int] = None
    max: Optional[int] = None
    clamped: bool = False


def __get_boundary(
    index: int,
    bin_edges: np.ndarray,
    clamped: bool,
    min_max: Tuple[float, float],
) -> Union[int, float]:
    if index > 0 and index < len(bin_edges):
        return bin_edges[index - 1]
    elif index >= len(bin_edges):
        return min_max[1] if clamped else np.inf
    else:
        return min_max[0] if clamped else -np.inf


def bin(step: Step, store: TableStore):
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
    args = BinArgs(
        to=step.args["to"],
        column=step.args["column"],
        strategy=BinStrategy(step.args["strategy"]),
        fixedcount=step.args.get("fixedcount", None),
        fixedwidth=step.args.get("fixedwidth", None),
        min=step.args.get("min", None),
        max=step.args.get("max", None),
        clamped=step.args.get("clamped", None),
    )
    input_table = store.table(step.input)
    min_max = (
        (args.min, args.max)
        if args.min is not None and args.max is not None
        else (np.min(input_table[args.column]), np.max(input_table[args.column]))
    )

    if args.strategy == BinStrategy.Auto:
        bin_edges = np.histogram_bin_edges(
            input_table[args.column], bins="auto", range=min_max
        )
    elif args.strategy == BinStrategy.FixedCount and args.fixedcount is not None:
        bin_edges = np.histogram_bin_edges(
            input_table[args.column], bins=args.fixedcount, range=min_max
        )
    elif args.strategy == BinStrategy.FixedWidth:
        bin_edges = np.histogram_bin_edges(
            input_table[args.column],
            bins=np.arange(min_max[0], min_max[1], args.fixedwidth, dtype=int),
            range=min_max,
        )

    if not args.clamped:
        bin_edges = np.array([-np.inf] + [float(edge) for edge in bin_edges] + [np.inf])

    value_edges = [
        __get_boundary(bin_index, bin_edges, args.clamped, min_max)
        for _, bin_index in enumerate(
            np.searchsorted(bin_edges, input_table[args.column], side="right")
        )
    ]
    output = input_table.copy()
    output[args.to] = value_edges
    return TableContainer(id=step.output, name=step.output, table=output)
