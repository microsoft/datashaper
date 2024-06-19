#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unorder verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, apply_decorators, inputs, outputs, verb


def unorder(table: pd.DataFrame, **_kwargs: Any) -> pd.DataFrame:
    """Unorder verb implementation."""
    return table.sort_index()


apply_decorators(
    [
        verb(name="unorder", immutable_input=True),
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
    unorder,
)
