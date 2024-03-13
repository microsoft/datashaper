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
from datashaper.engine.verbs.parallel_verb import OperationType, parallel_verb
from datashaper.table_store.types import Table
from datashaper.workflow.verb_callbacks.verb_callbacks import VerbCallbacks


@parallel_verb(
    name="filter",
    treats_input_tables_as_immutable=True,
    operation_type=OperationType.CHUNK,
)
async def filter_verb(
    chunk: Table,
    callbacks: VerbCallbacks,  # noqa: ARG001
    column: str,
    criteria: list,
    logical: str = "or",
    **_kwargs: dict,
) -> Table:
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

    input_table = cast(pd.DataFrame, chunk)

    filter_index = filter_df(
        input_table, FilterArgs(column, filter_criteria, logical_operator)
    )
    sub_idx = filter_index == True  # noqa: E712
    idx = filter_index[sub_idx].index  # type: ignore
    return cast(Table, input_table[chunk.index.isin(idx)].reset_index(drop=True))
