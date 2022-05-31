#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from data_wrangling_components.engine.pandas.filter_df import _boolean_function_map
from data_wrangling_components.table_store import TableContainer
from data_wrangling_components.types import BooleanLogicalOperator


def boolean(input: TableContainer, to: str, columns: List[str], operator: str):

    logical_operator = BooleanLogicalOperator(operator)
    input_table = input.table
    output = input_table.copy()
    output[to] = _boolean_function_map[logical_operator](output)

    return TableContainer(table=output)
