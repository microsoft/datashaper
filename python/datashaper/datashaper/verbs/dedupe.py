#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Dedupe verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb


def dedupe(
    table: pd.DataFrame, columns: list[str] | None = None, **_kwargs: Any
) -> pd.DataFrame:
    """Dedupe verb implementation."""
    return table.drop_duplicates(columns)


apply_decorators(
    [
        verb(name="dedupe", immutable_input=True),
        inputs(default_argument_name="table"),
        outputs(return_type=OutputReturnType.Table),
    ],
    dedupe,
)
