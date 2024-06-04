#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Copy verb implementation."""

from typing import Any

import pandas as pd

from .decorators import VerbInputSpec, verb


@verb(name="copy", input=VerbInputSpec("table"))
def copy(
    table: pd.DataFrame,
    to: str,
    column: str,
    **_kwargs: Any,
) -> pd.DataFrame:
    """Copy verb implementation."""
    table[to] = table[column]
    return table
