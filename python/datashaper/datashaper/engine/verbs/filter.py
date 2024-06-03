#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Filter verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.verbs.parallel_verb import OperationType, parallel_verb
from datashaper.table_store.types import Table
from datashaper.types import (
    ComparisonStrategy,
    FilterArgs,
    StringComparisonOperator,
)
from datashaper.verbs.pandas.filter_df import filter_df, get_operator
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
    value: Any,
    strategy: ComparisonStrategy = ComparisonStrategy.Value,
    operator: StringComparisonOperator = StringComparisonOperator.Equals,
    **_kwargs: Any,
) -> Table:
    """Filter verb implementation."""
    input_table = cast(pd.DataFrame, chunk)

    filter_index = filter_df(
        input_table,
        FilterArgs(
            column,
            value=value,
            strategy=ComparisonStrategy(strategy),
            operator=get_operator(operator),
        ),
    )
    sub_idx = filter_index == True  # noqa: E712
    idx = filter_index[sub_idx].index  # type: ignore
    return cast(Table, input_table[chunk.index.isin(idx)].reset_index(drop=True))
