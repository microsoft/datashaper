#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Ungroup verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb


def ungroup(table: pd.DataFrame, **_kwargs: Any) -> pd.DataFrame:
    """Ungroup verb implementation."""
    return table.obj


apply_decorators(
    [
        verb(name="ungroup", immutable_input=True),
        inputs(default_argument_name="table"),
        outputs(return_type=OutputReturnType.Table),
    ],
    ungroup,
)
