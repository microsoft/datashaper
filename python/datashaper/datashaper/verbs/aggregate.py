#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Aggregate verb implementation."""

from functools import reduce
from typing import cast

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper.constants import DEFAULT_INPUT_NAME

from .decorators import (
    OutputMode,
    wrap_verb_result,
)
from .types import FieldAggregateOperation


@verb(
    name="aggregate",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="to", required=True),
        ConfigPort(name="groupby", required=True),
        ConfigPort(name="column", required=True),
        ConfigPort(name="operation", required=True),
    ],
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def aggregate(
    table: pd.DataFrame,
    to: str,
    groupby: list[str],
    column: str,
    operation: FieldAggregateOperation,
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
