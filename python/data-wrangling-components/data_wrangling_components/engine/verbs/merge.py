#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from functools import partial
from typing import Any, Callable, Dict

import pandas as pd

from dataclasses import dataclass
from pandas.api.types import is_bool

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import (
    InputColumnListArgs,
    MergeStrategy,
    OutputColumnArgs,
    Step,
)


def correct_type(value: Any):
    if is_bool(value):
        return str(value).lower()
    try:
        return int(value) if value.is_integer() else value
    except AttributeError:
        return value


def create_array(column: pd.Series, delim: str) -> str:
    column = column.dropna().apply(lambda x: correct_type(x))
    return delim.join(column.astype(str))


__strategy_mapping: Dict[MergeStrategy, Callable] = {
    MergeStrategy.FirstOneWins: lambda values, **kwargs: values.dropna().apply(
        lambda x: correct_type(x)
    )[0],
    MergeStrategy.LastOneWins: lambda values, **kwargs: values.dropna().apply(
        lambda x: correct_type(x)
    )[-1],
    MergeStrategy.Concat: lambda values, delim, **kwargs: create_array(values, delim),
    MergeStrategy.CreateArray: lambda values, **kwargs: create_array(values, ","),
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
