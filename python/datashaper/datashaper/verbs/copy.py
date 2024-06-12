#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Copy verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb


def copy(
    table: pd.DataFrame,
    to: str,
    column: str,
    **_kwargs: Any,
) -> pd.DataFrame:
    """Copy verb implementation."""
    table[to] = table[column]
    return table


apply_decorators(
    [
        verb(name="copy"),
        inputs(default_argument_name="table"),
        outputs(return_type=OutputReturnType.Table),
    ],
    copy,
)
