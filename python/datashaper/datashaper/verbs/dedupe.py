#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Dedupe verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="dedupe",
    immutable_input=True,
    adapters=[inputs(default_input_argname="table"), outputs(mode=OutputMode.Table)],
)
def dedupe(
    table: pd.DataFrame, columns: list[str] | None = None, **_kwargs: Any
) -> pd.DataFrame:
    """Dedupe verb implementation."""
    return table.drop_duplicates(columns)
