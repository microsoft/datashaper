#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from datashaper.engine.pandas import filter_df, get_operator
from datashaper.engine.types import (
    BooleanLogicalOperator,
    Criterion,
    FilterArgs,
    FilterCompareType,
)
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="filter")
def filter(input: VerbInput, column: str, criteria: List, logical: str = "or"):
    filter_criteria = [
        Criterion(
            value=arg.get("value", None),
            type=FilterCompareType(arg["type"]),
            operator=get_operator(arg["operator"]),
        )
        for arg in criteria
    ]
    logical_operator = BooleanLogicalOperator(logical)
    input_table = input.get_input()

    filter_index = filter_df(
        input_table, FilterArgs(column, filter_criteria, logical_operator)
    )

    idx = filter_index[filter_index == True].index  # noqa: E712
    output = input_table[input_table.index.isin(idx)].reset_index(drop=True)

    return TableContainer(table=output)
