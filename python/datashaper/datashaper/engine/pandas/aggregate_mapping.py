"""Mapping of FieldAggregateOperation to pandas aggregate functions."""
from functools import reduce

from datashaper.engine.types import FieldAggregateOperation

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
