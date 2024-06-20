#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Impute verb implementation."""

from typing import Any, cast

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="impute",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def impute(
    table: pd.DataFrame, column: str, value: str | float | bool, **_kwargs: Any
) -> pd.DataFrame:
    """Impute verb implementation."""
    table[column] = cast(pd.Series, table[column].fillna(value))
    return table
