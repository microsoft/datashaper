#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from data_wrangling_components.table_store import TableContainer


def groupby(input: TableContainer, columns: List[str]):
    input_table = input.table
    output = input_table.groupby(by=columns)
    return TableContainer(table=output)
