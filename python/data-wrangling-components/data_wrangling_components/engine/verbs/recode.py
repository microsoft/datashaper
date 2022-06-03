#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict

from data_wrangling_components.table_store import TableContainer


class RecodeMap(dict):
    def __missing__(self, key):
        return key


def recode(input: TableContainer, to: str, column: str, map: Dict):
    map = RecodeMap(map)

    input_table = input.table

    output = input_table.copy()
    output[to] = output[column].map(map)
    return TableContainer(table=output)
