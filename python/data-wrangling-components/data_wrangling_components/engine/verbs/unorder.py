#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.table_store import TableContainer


def unorder(input: TableContainer):
    input_table = input.table

    output = input_table.sort_index()
    return TableContainer(table=output)
