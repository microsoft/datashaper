#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict

from data_wrangling_components.table_store import TableContainer


def rename(input: TableContainer, columns: Dict[str, str]):
    input_table = input.table
    output = input_table.rename(columns=columns)
    return TableContainer(table=output)
