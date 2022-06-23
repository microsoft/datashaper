#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List
import pandas as pd

from data_wrangling_components.engine.verbs.verb_input import VerbInput
from data_wrangling_components.table_store import TableContainer


def __has_prefix(index: int, prefixes: List[str]):
    try:
        return prefixes[index] is not None and len(prefixes[index].strip()) > 0
    except IndexError:
        return False


def __get_prefix(index: int, columns: List[str], prefixes: List[str]):
    return prefixes[index] if __has_prefix(index, prefixes) else columns[index] + "_"


def onehot(input: VerbInput, columns: List[str], prefixes: List[str] = []):
    input_table = input.get_input()
    input_table[columns] = input_table[columns].astype("category")
    prefixes = [__get_prefix(index, columns, prefixes) for index in range(len(columns))]

    dummies = pd.get_dummies(input_table[columns], prefix=prefixes, prefix_sep="")
    for column in columns:
        dummies.loc[input_table[column].isnull(), dummies.columns] = None
    output = pd.concat([input_table, dummies], axis=1)

    return TableContainer(table=output)
