#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Aggregate verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.types import FieldAggregateOperation

from .decorators import VerbInputSpec, verb
from .utils.pandas.aggregate_mapping import aggregate_operation_mapping


@verb(name="aggregate", input=VerbInputSpec("table", immutable=True))
def aggregate(
    table: pd.DataFrame,
    to: str,
    groupby: list[str],
    column: str,
    operation: FieldAggregateOperation,
    **_kwargs: Any,
) -> pd.DataFrame:
    """Aggregate verb implementation."""
    result = cast(
        pd.DataFrame,
        table.groupby(groupby).agg({column: aggregate_operation_mapping[operation]}),
    )
    result[to] = result[column]
    result.drop(column, axis=1, inplace=True)
    return result.reset_index()
