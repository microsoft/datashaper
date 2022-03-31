#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Optional, Union

import pandas as pd

from data_wrangling_components.types import (
    FilterArgs,
    FilterCompareType,
    NumericComparisonOperator,
    StringComparisonOperator,
)


_operator_map = {
    StringComparisonOperator.Contains: "contains",
    StringComparisonOperator.StartsWith: "startswith",
    StringComparisonOperator.EndsWith: "endswith",
    StringComparisonOperator.Equal: "==",
    StringComparisonOperator.NotEqual: "!=",
    StringComparisonOperator.Empty: "isnull()",
    StringComparisonOperator.NotEmpty: "notnull()",
    NumericComparisonOperator.Eq: "==",
    NumericComparisonOperator.Empty: "isnull()",
    NumericComparisonOperator.NotEmpty: "notnull()",
}


def filter_df(df: pd.DataFrame, args: FilterArgs) -> pd.DataFrame:
    value: Optional[Union[str, float]] = None
    if args.type == FilterCompareType.Column:
        value = f"`{args.value}`"
    else:
        value = (
            f"'{args.value}'"
            if args.operator
            in [StringComparisonOperator.Equal, StringComparisonOperator.NotEqual]
            else args.value
        )

    if args.operator in [
        NumericComparisonOperator.NotEmpty,
        StringComparisonOperator.NotEmpty,
        NumericComparisonOperator.Empty,
        StringComparisonOperator.Empty,
    ]:
        operator = _operator_map[args.operator]
        return df.query(f"`{args.column}`.{operator}")
    elif args.operator in [
        StringComparisonOperator.Contains,
        StringComparisonOperator.StartsWith,
        StringComparisonOperator.EndsWith,
    ]:
        return df.loc[
            getattr(df[args.column].str, _operator_map[args.operator])(value, na=False)
        ]
    else:
        operator = _operator_map.get(args.operator, args.operator.value)
        return df.query(f"`{args.column}` {operator} {value}")
