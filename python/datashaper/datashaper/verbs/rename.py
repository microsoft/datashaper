#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Rename verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb


def rename(
    table: pd.DataFrame, columns: dict[str, str], **_kwargs: Any
) -> pd.DataFrame:
    """Rename verb implementation."""
    return table.rename(columns=columns)


apply_decorators(
    [
        verb(name="rename"),
        inputs(default_argument_name="table"),
        outputs(return_type=OutputReturnType.Table),
    ],
    rename,
)
