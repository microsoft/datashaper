#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from functools import partial
from typing import Callable, Dict, List, Union
from uuid import uuid4

import pandas as pd

from data_wrangling_components.types import (
    BooleanComparisonOperator,
    BooleanLogicalOperator,
    FilterArgs,
    FilterCompareType,
    NumericComparisonOperator,
    StringComparisonOperator,
)


_boolean_function_map = {
    BooleanLogicalOperator.OR: lambda df: df.any(axis="columns"),
    BooleanLogicalOperator.AND: lambda df: df.all(axis="columns"),
    BooleanLogicalOperator.NOR: lambda df: ~df.any(axis="columns"),
    BooleanLogicalOperator.NAND: lambda df: ~df.all(axis="columns"),
    BooleanLogicalOperator.XOR: lambda df: df.sum(axis="columns").apply(
        lambda x: x == 1
    ),
}


def __equals(
    df: pd.DataFrame,
    column: str,
    target: Union[pd.Series, str, int, float, bool],
    **kwargs,
) -> pd.Series:
    return df[column] == target


def __not_equals(
    df: pd.DataFrame,
    column: str,
    target: Union[pd.Series, str, int, float, bool],
    **kwargs,
) -> pd.Series:
    return ~df[column] == target


def __is_null(df: pd.DataFrame, column: str, **kwargs) -> pd.Series:
    return df[column].isnull()


def __is_not_null(df: pd.DataFrame, column: str, **kwargs) -> pd.Series:
    return df[column].notnull()


def __contains(
    df: pd.DataFrame,
    column: str,
    target: Union[pd.Series, str, int, float, bool],
    **kwargs,
) -> pd.Series:
    return df[column].str.contains(str(target), regex=False)


def __startswith(
    df: pd.DataFrame,
    column: str,
    target: Union[pd.Series, str, int, float, bool],
    **kwargs,
) -> pd.Series:
    return df[column].str.startswith(str(target))


def __endswith(
    df: pd.DataFrame,
    column: str,
    target: Union[pd.Series, str, int, float, bool],
    **kwargs,
) -> pd.Series:
    return df[column].str.endswith(str(target))


def __regex(
    df: pd.DataFrame,
    column: str,
    target: Union[pd.Series, str, int, float, bool],
    **kwargs,
) -> pd.Series:
    return df[column].str.contains(str(target), regex=True)


def __gt(
    df: pd.DataFrame,
    column: str,
    target: Union[pd.Series, str, int, float, bool],
    **kwargs,
) -> pd.Series:
    return df[column] > target


def __gte(
    df: pd.DataFrame,
    column: str,
    target: Union[pd.Series, str, int, float, bool],
    **kwargs,
) -> pd.Series:
    return df[column] >= target


def __lt(
    df: pd.DataFrame,
    column: str,
    target: Union[pd.Series, str, int, float, bool],
    **kwargs,
) -> pd.Series:
    return df[column] < target


def __lte(
    df: pd.DataFrame,
    column: str,
    target: Union[pd.Series, str, int, float, bool],
    **kwargs,
) -> pd.Series:
    return df[column] <= target


_operator_map: Dict[
    Union[
        StringComparisonOperator, NumericComparisonOperator, BooleanComparisonOperator
    ],
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


def filter_df(df: pd.DataFrame, args: FilterArgs) -> pd.DataFrame:
    filters: List[str] = []
    filtered_df: pd.DataFrame = df.copy()

    for criteria in args.criteria:
        filter_name = str(uuid4())
        filters.append(filter_name)
        if criteria.type == FilterCompareType.Column:
            filtered_df[filter_name] = _operator_map[criteria.operator](
                df=df, column=args.column, target=df[criteria.value]
            )
        else:
            filtered_df[filter_name] = _operator_map[criteria.operator](
                df=df, column=args.column, target=criteria.value
            )

    filtered_df["dwc_filter_result"] = _boolean_function_map[args.logical](
        filtered_df[filters]
    )

    return df[df.index.isin(filtered_df[filtered_df["dwc_filter_result"]].index)]
