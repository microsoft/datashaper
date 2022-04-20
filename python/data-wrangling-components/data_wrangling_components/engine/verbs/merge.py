#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from functools import partial
from typing import Callable, Dict

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import (
    InputColumnListArgs,
    MergeStrategy,
    OutputColumnArgs,
    Step,
)


__strategy_mapping: Dict[MergeStrategy, Callable] = {
    MergeStrategy.FirstOneWins: lambda column_values, **kwargs: column_values.dropna()[
        0
    ],
    MergeStrategy.LastOneWins: lambda column_values, **kwargs: column_values.dropna()[
        -1
    ],
    MergeStrategy.Concat: lambda column_values, delim, **kwargs: delim.join(
        column_values.dropna().astype(str)
    ),
    MergeStrategy.CreateArray: lambda column_values, **kwargs: ",".join(
        column_values.dropna().astype(str)
    ),
}


@dataclass
class MergeArgs(InputColumnListArgs, OutputColumnArgs):
    strategy: MergeStrategy
    delimiter: str = ""


def merge(step: Step, store: TableStore):
    args = MergeArgs(
        to=step.args["to"],
        columns=step.args["columns"],
        strategy=MergeStrategy(step.args["strategy"]),
        delimiter=step.args.get("delimiter", ""),
    )

    input_table = store.table(step.input)

    output = input_table.copy()
    output[args.to] = output[args.columns].apply(
        partial(__strategy_mapping[args.strategy], delim=args.delimiter), axis=1
    )

    return TableContainer(id=str(step.output), name=str(step.output), table=output)
