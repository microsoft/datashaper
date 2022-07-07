#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict, List

import numpy as np
import pandas as pd

from data_wrangling_components.engine.verbs.verb_input import VerbInput
from data_wrangling_components.table_store import TableContainer


def __has_prefix(column: str, prefixes: Dict[str, str]):
    if column in prefixes:
        return prefixes[column] is not None and len(prefixes[column].strip()) > 0
    else:
        return False


def __get_prefix(column: str, prefixes: Dict[str, str]):
    return prefixes[column] if __has_prefix(column, prefixes) else ""


def onehot(input: VerbInput, columns: List[str], prefixes: Dict[str, str] = {}):
    input_table = input.get_input()
    input_table[columns] = input_table[columns].astype("category")
    prefixesList = [__get_prefix(column, prefixes) for column in columns]

    dummies = pd.get_dummies(input_table[columns], prefix=prefixesList, prefix_sep="")
    for column in columns:
        cols = dummies.columns.str.startswith(__get_prefix(column, prefixes))
        dummies.loc[input_table[column].isnull(), cols] = np.nan
    output = pd.concat([input_table, dummies], axis=1)

    return TableContainer(table=output)
