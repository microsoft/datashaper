#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Print verb implementation."""

from typing import Any

import pandas as pd


def ds_print(
    table: pd.DataFrame, message: str, limit: int = 10, **_kwargs: Any
) -> pd.DataFrame:
    """Print verb implementation."""
    # TODO(Chris): should we use a logger for these instead of prints?
    print(message)  # noqa: T201
    print(table.to_string(max_rows=limit))  # noqa: T201

    return table
