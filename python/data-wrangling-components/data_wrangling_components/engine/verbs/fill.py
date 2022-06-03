#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Union

from data_wrangling_components.table_store import TableContainer


def fill(
    input: TableContainer,
    to: str,
    value: Union[str, int, float, bool],
):
    input_table = input.table
    output = input_table.copy()
    output[to] = value
    return TableContainer(table=output)
