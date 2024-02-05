#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from typing import cast

import numpy as np
import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="onehot")
def onehot(
    input: VerbInput,
    column: str,
    prefix: str = "",
    preserveSource=False,
):
    input_table = cast(pd.DataFrame, input.get_input())
    input_table[column] = input_table[column].astype("category")

    dummies = pd.get_dummies(input_table[[column]], prefix=[prefix], prefix_sep="")
    cols = dummies.columns.str.startswith(prefix)
    dummies.loc[input_table[column].isnull(), cols] = np.nan

    output = pd.concat([input_table, dummies], axis=1)
    if not preserveSource:
        output = output.drop(columns=column)

    return TableContainer(table=output)
