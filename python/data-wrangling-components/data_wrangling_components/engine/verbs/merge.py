#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
import copy

from functools import partial
from math import nan
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

def unhotOperation(input: VerbInput, columns: List[str], prefix: str):
    copyInput = copy.deepcopy(input)
    input_table = copyInput.get_input()

    for col in columns:
        index = col.index(prefix)
        value = col[index + len(prefix):len(col)]
        for i in range(len(input_table[col])):
            if(input_table[col][i] == 0):
                input_table[col][i] = nan
            else:
                input_table[col][i] = value

    return copyInput


def merge(
    input: VerbInput,
    to: str,
    columns: List[str],
    strategy: str,
    delimiter: str = "",
    keepOriginalColumns: bool = False,
    unhot: bool = False,
    prefix: str = ""
):
    merge_strategy = MergeStrategy(strategy)

    input_table = unhotOperation(input, columns, prefix).get_input() if unhot else input.get_input()

    output = input_table.copy()
    output[to] = output[columns].apply(
        partial(__strategy_mapping[merge_strategy], delim=delimiter), axis=1
    )

    filteredList: list[str] = []

    for col in output.columns:
        try:
            indexValue = columns.index(col)
        except ValueError:
            filteredList.append(col)

    if(keepOriginalColumns == False):
        output[to] = output[filteredList]

    print(output)

    return TableContainer(table=output)
