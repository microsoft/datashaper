#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Binarize verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.pandas import filter_df, get_operator
from datashaper.verbs.types import (
    ComparisonStrategy,
    FilterArgs,
    StringComparisonOperator,
)


def binarize(
    table: pd.DataFrame,
    to: str,
    column: str,
    value: Any,
    strategy: ComparisonStrategy = ComparisonStrategy.Value,
    operator: StringComparisonOperator = StringComparisonOperator.Equals,
    **_kwargs: Any,
) -> pd.DataFrame:
    """Binarize verb implementation."""
    filter_result = filter_df(
        table,
        FilterArgs(
            column,
            value=value,
            strategy=ComparisonStrategy(strategy),
            operator=get_operator(operator),
        ),
    )
    table[to] = filter_result.map(cast(Any, {True: 1, False: 0}), na_action="ignore")
    return table
