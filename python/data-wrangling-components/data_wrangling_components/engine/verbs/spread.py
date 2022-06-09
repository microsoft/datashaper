#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import numpy as np
import pandas as pd

from data_wrangling_components.engine.verbs.verb_input import VerbInput
from data_wrangling_components.table_store import TableContainer


def __normal_spread(input_table, columns, to, delimiter):
    output = input_table.copy()
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
        output = output.drop(column, axis=1)

    return output


def __onehot_spread(input_table, columns, to, delimiter):
    output = input_table.copy()
    for column, new_column_name in zip(columns, to):
        output[column] = output[column].astype(str).str.split(delimiter)
        onehot = output[column].str.join("|").str.get_dummies()
        onehot.columns = [f"{new_column_name}_{val}" for val in onehot.columns]

        output = pd.concat(
            [
                output.drop(column, axis=1),
                onehot,
            ],
            axis=1,
        )

    return output


def spread(
    input: VerbInput,
    columns: List[str],
    to: List[str] = None,
    delimiter: str = ",",
    onehot: bool = False,
):
    input_table = input.get_input()
    if to is None:
        to = columns

    if onehot:
        output = __onehot_spread(input_table, columns, to, delimiter)
    else:
        output = __normal_spread(input_table, columns, to, delimiter)

    return TableContainer(table=output)
