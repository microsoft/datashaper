#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Recode verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.decorators import verb


class RecodeMap(dict):
    """Recode map class."""

    def __missing__(self, key: str):
        """Return the key if it is not found in the mapping."""
        return key


@verb(name="recode")
def recode(
    table: pd.DataFrame, to: str, column: str, mapping: dict, **_kwargs: Any
) -> pd.DataFrame:
    """Recode verb implementation."""
    mapping = RecodeMap(mapping)
    table[to] = table[column].map(cast(Any, mapping))
    return table
