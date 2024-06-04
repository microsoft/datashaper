#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unroll verb implementation."""

from typing import Any

import pandas as pd

from datashaper.decorators import verb


@verb(name="unroll", treats_input_tables_as_immutable=True)
def unroll(table: pd.DataFrame, column: str, **_kwargs: Any) -> pd.DataFrame:
    """Unroll a column."""
    return table.explode(column).reset_index(drop=True)
