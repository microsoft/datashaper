#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Upper verb implementation."""

import pandas as pd

from datashaper.decorators import verb


@verb(name="strings.upper")
def upper(table: pd.DataFrame, column: str, to: str, **_kwargs: dict) -> pd.DataFrame:
    """Upper verb implementation."""
    table[to] = table[column].str.upper()
    return table
