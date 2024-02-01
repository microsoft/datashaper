#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Optional

import numpy as np
import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


def __normal_spread(input_table, columns, to, delimiter):
    output = input_table
    for column, new_column_name in zip(columns, to):
        new_columns = np.array(
            input_table[column].astype(str).str.split(delimiter).to_list()
        )
        columns = (
            [f"{new_column_name}_{i}" for i in range(1, len(new_columns[0]) + 1)]
            if len(new_columns[0]) > 1
            else [new_column_name]
        )
        new_columns = pd.DataFrame(
            new_columns,
            columns=columns,
        )
        output = pd.concat([output, new_columns], axis=1)

    return output


def __onehot_spread(input_table, columns, to, delimiter):
    output = input_table
    for column, new_column_name in zip(columns, to):
        output[column] = output[column].astype(str).str.split(delimiter)
        onehot = output[column].str.join("|").str.get_dummies()
        onehot.columns = [f"{new_column_name}_{val}" for val in onehot.columns]

        output = pd.concat(
            [
                output,
                onehot,
            ],
            axis=1,
        )

    return output


@verb(name="spread")
def spread(
    input: VerbInput,
    column: str,
    to: Optional[list[str]] = None,
    delimiter: str = ",",
    onehot: bool = False,
    preserveSource: bool = False,
):
    input_table = input.get_input()
    if to is None:
        to = [column]

    if onehot:
        output = __onehot_spread(input_table, [column], to, delimiter)
    else:
        output = __normal_spread(input_table, [column], to, delimiter)

    if not preserveSource:
        output = output.drop(columns=[column])

    return TableContainer(table=output)
