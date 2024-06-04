#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Rename verb implementation."""

from typing import Any

import pandas as pd

from .decorators import VerbInputSpec, verb


@verb(name="rename", input=VerbInputSpec("table", immutable=True))
def rename(
    table: pd.DataFrame, columns: dict[str, str], **_kwargs: Any
) -> pd.DataFrame:
    """Rename verb implementation."""
    return table.rename(columns=columns)
