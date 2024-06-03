#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Rollup verb implementation."""

from collections.abc import Iterable
from typing import Any

import pandas as pd

from datashaper.engine.pandas import aggregate_operation_mapping
from datashaper.verbs.types import FieldAggregateOperation


def rollup(
    table: pd.DataFrame, column: str, to: str, operation: str, **_kwargs: Any
) -> pd.DataFrame:
    """Rollup verb implementation."""
    aggregate_operation = FieldAggregateOperation(operation)

    agg_result = table[column].agg(aggregate_operation_mapping[aggregate_operation])

    if not isinstance(agg_result, Iterable):
        agg_result = [agg_result]
    if isinstance(agg_result, pd.Series):
        agg_result = agg_result.reset_index(drop=True)

    return pd.DataFrame({to: agg_result})
