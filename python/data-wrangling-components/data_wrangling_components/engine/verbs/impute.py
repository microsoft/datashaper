#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List, Union

from data_wrangling_components.table_store import TableContainer


def impute(
    input: TableContainer, columns: List[str], value: Union[str, int, float, bool]
):
    input_table = input.table
    output = input_table.copy()
    for column in columns:
        output[column] = output[column].fillna(value)
    return TableContainer(table=output)
