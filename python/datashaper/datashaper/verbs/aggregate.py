#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Aggregate verb implementation."""

from functools import reduce
from typing import Any, cast

import pandas as pd

from .decorators import (
    OutputMode,
    inputs,
    outputs,
    verb,
)
from .types import FieldAggregateOperation


@verb(
    name="aggregate",
    immutable_input=True,
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
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


aggregate_operation_mapping = {
    FieldAggregateOperation.Any: "first",
    FieldAggregateOperation.Count: "count",
    FieldAggregateOperation.CountDistinct: "nunique",
    FieldAggregateOperation.Valid: lambda series: series.dropna().count(),
    FieldAggregateOperation.Invalid: lambda series: series.isna().sum(),
    FieldAggregateOperation.Max: "max",
    FieldAggregateOperation.Min: "min",
    FieldAggregateOperation.Sum: "sum",
    FieldAggregateOperation.Product: lambda series: reduce(lambda x, y: x * y, series),
    FieldAggregateOperation.Mean: "mean",
    FieldAggregateOperation.Median: "median",
    FieldAggregateOperation.StDev: "std",
    FieldAggregateOperation.StDevPopulation: "",
    FieldAggregateOperation.Variance: "variance",
    FieldAggregateOperation.ArrayAgg: lambda series: [e for e in series],
    FieldAggregateOperation.ArrayAggDistinct: lambda series: [
        e for e in series.unique()
    ],
}
