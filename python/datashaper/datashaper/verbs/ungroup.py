#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Ungroup verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="ungroup",
    immutable_input=True,
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def ungroup(table: pd.DataFrame, **_kwargs: Any) -> pd.DataFrame:
    """Ungroup verb implementation."""
    return table.obj
