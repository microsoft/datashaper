#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List
import pandas as pd

from data_wrangling_components.engine.verbs.verb_input import VerbInput
from data_wrangling_components.table_store import TableContainer


def onehot(input: VerbInput, columns: List[str], prefixes: List[str] = []):
    def hasPrefix(index: int):
        try:
            return prefixes[index] != '' and prefixes[index] != None
        except IndexError:
            return False

    def getPrefix(index: int):
        if hasPrefix(index):
            return prefixes[index]
        else:
            return columns[index] + "_"

    input_table = input.get_input()
    prefixes = [getPrefix(index) for index in range(len(columns))]

    dummies = pd.get_dummies(input_table[columns], prefix=prefixes, prefix_sep="")
    dummies.loc[input_table[columns].isnull(), dummies.columns] = None
    output = pd.concat([input_table, dummies], axis=1)

    return TableContainer(table=output)
