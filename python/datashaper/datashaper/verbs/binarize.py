#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Binarize verb implementation."""

from typing import Any, cast

import pandas as pd

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb
from .filter import filter, get_comparison_operator
from .types import (
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
    filter_result = filter(
        table,
        FilterArgs(
            column,
            value=value,
            strategy=ComparisonStrategy(strategy),
            operator=get_comparison_operator(operator),
        ),
    )
    table[to] = filter_result.map(cast(Any, {True: 1, False: 0}), na_action="ignore")
    return table


apply_decorators(
    [
        verb(name="binarize"),
        inputs(default_argument_name="table"),
        outputs(return_type=OutputReturnType.Table),
    ],
    binarize,
)
