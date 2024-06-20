#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Fill verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="fill",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def fill(
    table: pd.DataFrame, to: str, value: str | float | bool, **_kwargs: Any
) -> pd.DataFrame:
    """Fill verb implementation."""
    table[to] = value
    return table
