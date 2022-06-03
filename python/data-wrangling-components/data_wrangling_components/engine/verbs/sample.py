#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.table_store import TableContainer


def sample(input: TableContainer, size: int = None, proportion: int = None):
    input_table = input.table
    output = input_table.sample(n=size, frac=proportion)
    return TableContainer(table=output)
