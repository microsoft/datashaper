#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from functools import partial
from typing import Any, Callable, Dict, List

import pandas as pd

from pandas.api.types import is_bool

from data_wrangling_components.engine.verbs.verb_input import VerbInput
from data_wrangling_components.table_store import TableContainer
from data_wrangling_components.types import MergeStrategy


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


def merge(
    input: VerbInput,
    to: str,
    columns: List[str],
    strategy: str,
    delimiter: str = "",
    keepOriginalColumns: bool = True,
    unhot: bool = False,
    prefix: str = ""
):
    merge_strategy = MergeStrategy(strategy)

    input_table = input.get_input()

    output = input_table.copy()
    output[to] = output[columns].apply(
        partial(__strategy_mapping[merge_strategy], delim=delimiter), axis=1
    )

    return TableContainer(table=output)
