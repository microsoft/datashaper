#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unroll verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="unroll",
    immutable_input=True,
    adapters=[inputs(default_input_argname="table"), outputs(mode=OutputMode.Table)],
)
def unroll(table: pd.DataFrame, column: str, **_kwargs: Any) -> pd.DataFrame:
    """Unroll a column."""
    return table.explode(column).reset_index(drop=True)
