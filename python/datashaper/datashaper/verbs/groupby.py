#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Groupby verb implementation."""

from typing import Any

import pandas as pd


def groupby(table: pd.DataFrame, columns: list[str], **_kwargs: Any) -> pd.DataFrame:
    """Groupby verb implementation."""
    return table.groupby(by=columns)
