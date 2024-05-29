#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Verb filtering utilities."""

import logging
from collections.abc import Callable
from functools import partial
from uuid import uuid4

import polars as pl

from datashaper.engine.types import (
    BooleanComparisonOperator,
    BooleanLogicalOperator,
    FilterArgs,
    FilterCompareType,
    NumericComparisonOperator,
    StringComparisonOperator,
)
from datashaper.errors import UnsupportedComparisonOperatorError

boolean_function_map = {
    BooleanLogicalOperator.OR: lambda df, columns: df[columns].any()
    if columns != ""
    else df.any(),
    BooleanLogicalOperator.AND: lambda df, columns: df[columns].all()
    if columns != ""
    else df.all(),
    BooleanLogicalOperator.NOR: lambda df, columns: ~df[columns].any()
    if columns != ""
    else ~df.any(),
    BooleanLogicalOperator.NAND: lambda df, columns: ~df[columns].all()
    if columns != ""
    else ~df.all(),
    BooleanLogicalOperator.XNOR: lambda df, columns: df[columns]
    .sum()
    .apply(lambda x: (x % 2) == 0 or x == 0)
    if columns != ""
    else df.sum().apply(lambda x: (x % 2) == 0 or x == 0),
    BooleanLogicalOperator.XOR: lambda df, columns: df[columns]
    .sum()
    .apply(lambda x: (x % 2) != 0 and x != 0)
    if columns != ""
    else df.sum().apply(lambda x: (x % 2) != 0 and x != 0),
}


def __correct_unknown_value(df: pl.DataFrame, columns: list[str], target: str) -> None:
    na_index = df[df[columns].is_nan().any()].index
    df.loc[na_index, target] = None


def __equals(
    df: pl.DataFrame,
    column: str,
    target: pl.Series | str | float | bool,
    **_kwargs: dict,
) -> pl.Series:
    return df[column] == target


def __not_equals(
    df: pl.DataFrame,
    column: str,
    target: pl.Series | str | float | bool,
    **_kwargs: dict,
) -> pl.Series:
    return ~df[column] == target


def __is_null(
    df: pl.DataFrame, column: str, **_kwargs: dict
) -> pl.DataFrame | pl.Series:
    return df[column].isna()


def __is_not_null(
    df: pl.DataFrame, column: str, **_kwargs: dict
) -> pl.DataFrame | pl.Series:
    return df[column].notna()


def __contains(
    df: pl.DataFrame,
    column: str,
    target: pl.Series | str | float | bool,
    **_kwargs: dict,
) -> pl.DataFrame | pl.Series:
    return df[column].str.contains(str(target), regex=False)


def __startswith(
    df: pl.DataFrame,
    column: str,
    target: pl.Series | str | float | bool,
    **_kwargs: dict,
) -> pl.DataFrame | pl.Series:
    return df[column].str.starts_with(str(target))


def __endswith(
    df: pl.DataFrame,
    column: str,
    target: pl.Series | str | float | bool,
    **_kwargs: dict,
) -> pl.Series:
    return df[column].str.endswith(str(target))


def __regex(
    df: pl.DataFrame,
    column: str,
    target: pl.Series | str | float | bool,
    **_kwargs: dict,
) -> pl.Series:
    return df[column].str.contains(str(target), regex=True)


def __gt(
    df: pl.DataFrame,
    column: str,
    target: pl.Series | str | float | bool,
    **_kwargs: dict,
) -> pl.Series:
    return df[column] > target


def __gte(
    df: pl.DataFrame,
    column: str,
    target: pl.Series | str | float | bool,
    **_kwargs: dict,
) -> pl.Series:
    return df[column] >= target


def __lt(
    df: pl.DataFrame,
    column: str,
    target: pl.Series | str | float | bool,
    **_kwargs: dict,
) -> pl.Series:
    return df[column] < target


def __lte(
    df: pl.DataFrame,
    column: str,
    target: pl.Series | str | float | bool,
    **_kwargs: dict,
) -> pl.Series:
    return df[column] <= target


_empty_comparisons = {
    StringComparisonOperator.IsEmpty,
    StringComparisonOperator.IsNotEmpty,
    NumericComparisonOperator.IsEmpty,
    NumericComparisonOperator.IsNotEmpty,
    BooleanComparisonOperator.IsEmpty,
    BooleanComparisonOperator.IsNotEmpty,
}

_operator_map: dict[
    StringComparisonOperator | NumericComparisonOperator | BooleanComparisonOperator,
    Callable,
] = {
    StringComparisonOperator.Contains: __contains,
    StringComparisonOperator.StartsWith: __startswith,
    StringComparisonOperator.EndsWith: __endswith,
    StringComparisonOperator.Equals: __equals,
    StringComparisonOperator.NotEqual: __not_equals,
    StringComparisonOperator.IsEmpty: __is_null,
    StringComparisonOperator.IsNotEmpty: __is_not_null,
    StringComparisonOperator.RegularExpression: __regex,
    NumericComparisonOperator.Equals: __equals,
    NumericComparisonOperator.IsEmpty: __is_null,
    NumericComparisonOperator.IsNotEmpty: __is_not_null,
    NumericComparisonOperator.GreaterThan: __gt,
    NumericComparisonOperator.GreaterThanOrEqual: __gte,
    NumericComparisonOperator.LessThan: __lt,
    NumericComparisonOperator.LessThanOrEqual: __lte,
    BooleanComparisonOperator.Equals: __equals,
    BooleanComparisonOperator.NotEqual: __not_equals,
    BooleanComparisonOperator.IsEmpty: __is_null,
    BooleanComparisonOperator.IsNotEmpty: __is_not_null,
    BooleanComparisonOperator.IsTrue: partial(__equals, target=True),
    BooleanComparisonOperator.IsFalse: partial(__equals, target=False),
}


def filter_df(df: pl.DataFrame, args: FilterArgs) -> pl.DataFrame | pl.Series:
    """Filter a DataFrame based on the input criteria."""
    filters: list[str] = []
    filtered_df: pl.DataFrame = df.clone()

    filter_name = str(uuid4())
    filters.append(filter_name)
    if args.criteria.type == FilterCompareType.Column:
        filtered_df[filter_name] = _operator_map[args.criteria.operator](
            df=df, column=args.column, target=df[args.criteria.value]
        )
        if args.criteria.operator not in _empty_comparisons:
            __correct_unknown_value(
                filtered_df, [args.column, args.criteria.value], filter_name
            )
    else:
        filtered_df[filter_name] = _operator_map[args.criteria.operator](
            df=df, column=args.column, target=args.criteria.value
        )

    filtered_df["dwc_filter_result"] = boolean_function_map[BooleanLogicalOperator.OR](
        filtered_df[filters], ""
    )

    __correct_unknown_value(filtered_df, filters, "dwc_filter_result")

    return filtered_df["dwc_filter_result"]


def get_operator(
    operator: str,
) -> StringComparisonOperator | NumericComparisonOperator | BooleanComparisonOperator:
    """Get a comparison operator based on the input string."""
    try:
        return StringComparisonOperator(operator)
    except Exception:
        logging.info("%s is not a string comparison operator", operator)
    try:
        return NumericComparisonOperator(operator)
    except Exception:
        logging.info("%s is not a numeric comparison operator", operator)
    try:
        return BooleanComparisonOperator(operator)
    except Exception:
        logging.info("%s is not a boolean comparison operator", operator)
    raise UnsupportedComparisonOperatorError(operator)
