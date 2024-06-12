#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Fill verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb


def fill(
    table: pd.DataFrame, to: str, value: str | float | bool, **_kwargs: Any
) -> pd.DataFrame:
    """Fill verb implementation."""
    table[to] = value
    return table


apply_decorators(
    [
        verb(name="fill"),
        inputs(default_argument_name="table"),
        outputs(return_type=OutputReturnType.Table),
    ],
    fill,
)
