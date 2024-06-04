#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Union verb implementation."""

from typing import Any

import pandas as pd

from .decorators import VerbInputSpec, verb


@verb(name="union", input=VerbInputSpec("table", variadic="others", immutable=True))
def union(
    table: pd.DataFrame, others: list[pd.DataFrame], **_kwargs: Any
) -> pd.DataFrame:
    """Union verb implementation."""
    return pd.concat([table, *others], ignore_index=True).drop_duplicates()
