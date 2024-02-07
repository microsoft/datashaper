#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Filter verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.pandas import filter_df, get_operator
from datashaper.engine.types import (
    BooleanLogicalOperator,
    Criterion,
    FilterArgs,
    FilterCompareType,
)
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import Table, TableContainer


@verb(name="filter", treats_input_tables_as_immutable=True)
def filter(input: VerbInput, column: str, criteria: list, logical: str = "or"):
    """Filter verb implementation."""
    filter_criteria = [
        Criterion(
            value=arg.get("value", None),
            type=FilterCompareType(arg["type"]),
            operator=get_operator(arg["operator"]),
        )
        for arg in criteria
    ]
    logical_operator = BooleanLogicalOperator(logical)
    input_table = cast(pd.DataFrame, input.get_input())

    filter_index = filter_df(
        input_table, FilterArgs(column, filter_criteria, logical_operator)
    )
    sub_idx = filter_index == True  # noqa: E712
    idx = filter_index[sub_idx].index  # type: ignore
    output = input_table[input_table.index.isin(idx)].reset_index(drop=True)

    return TableContainer(table=cast(Table, output))
