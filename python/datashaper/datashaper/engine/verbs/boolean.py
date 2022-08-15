#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from datashaper.engine.pandas.filter_df import _boolean_function_map
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.table_store import TableContainer
from datashaper.types import BooleanLogicalOperator


def boolean(input: VerbInput, to: str, columns: List[str], operator: str):

    logical_operator = BooleanLogicalOperator(operator)
    input_table = input.get_input()
    output = input_table.copy()
    output[to] = _boolean_function_map[logical_operator](output, columns)

    return TableContainer(table=output)
