#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Ungroup verb implementation."""

from typing import Any

import pandas as pd


def ungroup(table: pd.DataFrame, **_kwargs: Any) -> pd.DataFrame:
    """Ungroup verb implementation."""
    return table.obj
