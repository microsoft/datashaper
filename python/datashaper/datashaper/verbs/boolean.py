#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Boolean verb implementation."""

from typing import Any

import pandas as pd

from datashaper.types import BooleanLogicalOperator

from .pandas.filter_df import boolean_function_map


def boolean(
    table: pd.DataFrame, to: str, columns: list[str], operator: str, **_kwargs: Any
) -> pd.DataFrame:
    """Boolean verb implementation."""
    logical_operator = BooleanLogicalOperator(operator)
    table[to] = boolean_function_map[logical_operator](table, columns)
    return table