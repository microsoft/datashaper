#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Aggregate verb implementation."""

from typing import Any

import pandas as pd

from datashaper.engine.pandas import aggregate_operation_mapping
from datashaper.verbs.types import FieldAggregateOperation


def aggregate(
    table: pd.DataFrame,
    to: str,
    groupby: list[str],
    column: str,
    operation: FieldAggregateOperation,
    **_kwargs: Any,
) -> pd.DataFrame:
    """Aggregate verb implementation."""
    result = (
        table.get_input()
        .groupby(groupby)
        .agg({column: aggregate_operation_mapping[operation]})
    )
    result[to] = result[column]
    result.drop(column, axis=1, inplace=True)
    return result.reset_index()
