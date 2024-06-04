#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unroll verb implementation."""

from typing import Any

import pandas as pd

from .decorators import VerbInputSpec, verb


@verb(name="unroll", input=VerbInputSpec("table", immutable=True))
def unroll(table: pd.DataFrame, column: str, **_kwargs: Any) -> pd.DataFrame:
    """Unroll a column."""
    return table.explode(column).reset_index(drop=True)
