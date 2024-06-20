#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unorder verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="unorder",
    immutable_input=True,
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def unorder(table: pd.DataFrame, **_kwargs: Any) -> pd.DataFrame:
    """Unorder verb implementation."""
    return table.sort_index()
