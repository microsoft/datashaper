#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Merge verb implementation."""

from functools import partial
from typing import Any

import pandas as pd

from datashaper.types import MergeStrategy

from .pandas.merge_strategies import merge_strategies


def merge(
    table: pd.DataFrame,
    to: str,
    columns: list[str],
    strategy: str,
    delimiter: str = "",
    preserveSource: bool = False,  # noqa: N803
    **_kwargs: Any,
) -> pd.DataFrame:
    """Merge verb implementation."""
    merge_strategy = MergeStrategy(strategy)

    table[to] = table[columns].apply(
        partial(merge_strategies[merge_strategy], delim=delimiter), axis=1
    )

    if not preserveSource:
        table.drop(columns=columns, inplace=True)

    return table
