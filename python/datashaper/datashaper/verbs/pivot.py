#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Pivot verb implementation."""

from typing import Any

import pandas as pd

from datashaper.types import FieldAggregateOperation

from .pandas.aggregate_mapping import aggregate_operation_mapping


def pivot(
    table: pd.DataFrame, key: str, value: str, operation: str, **_kwargs: Any
) -> pd.DataFrame:
    """Pivot verb implementation."""
    aggregate_operation = FieldAggregateOperation(operation)
    return table.pivot_table(
        values=value,
        columns=key,
        aggfunc=aggregate_operation_mapping[aggregate_operation],
    )
