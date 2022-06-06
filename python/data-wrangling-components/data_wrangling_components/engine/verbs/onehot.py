#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import pandas as pd

from data_wrangling_components.engine.verbs.verb_input import VerbInput
from data_wrangling_components.table_store import TableContainer


def onehot(input: VerbInput, column: str, prefix: str = ""):
    input_table = input.get_input()
    dummies = pd.get_dummies(input_table[column], prefix=prefix, prefix_sep="")
    dummies.loc[input_table[column].isnull(), dummies.columns] = None
    output = pd.concat([input_table, dummies], axis=1)

    return TableContainer(table=output)
