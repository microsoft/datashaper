#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Fill verb implementation."""

from typing import Any

import pandas as pd

from .decorators import VerbInputSpec, verb


@verb(name="fill", input=VerbInputSpec("table"))
def fill(
    table: pd.DataFrame, to: str, value: str | float | bool, **_kwargs: Any
) -> pd.DataFrame:
    """Fill verb implementation."""
    table[to] = value
    return table
