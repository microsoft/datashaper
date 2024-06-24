#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Erase verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, inputs, verb, wrap_verb_result


@verb(
    name="erase",
    adapters=[
        inputs(default_input_argname="table"),
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def erase(
    table: pd.DataFrame, column: str, value: str | float, **_kwargs: Any
) -> pd.DataFrame:
    """Erase verb implementation."""
    table[column] = table[column].apply(
        lambda df_value: None if df_value == value else df_value
    )
    return table
