#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from functools import partial
from typing import Callable, Dict, List, Union
from uuid import uuid4

import pandas as pd

from data_wrangling_components.engine.verbs.boolean import _boolean_function_map
from data_wrangling_components.types import (
    BooleanComparisonOperator,
    FilterArgs,
    FilterCompareType,
    NumericComparisonOperator,
    StringComparisonOperator,
)


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

    return df[(filtered_df["dwc_filter_result"] == True).index]
