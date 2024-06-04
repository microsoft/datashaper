#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Dedupe verb implementation."""

from typing import Any

import pandas as pd

from datashaper.decorators import verb


@verb(name="dedupe", treats_input_tables_as_immutable=True)
def dedupe(
    table: pd.DataFrame, columns: list[str] | None = None, **_kwargs: Any
) -> pd.DataFrame:
    """Dedupe verb implementation."""
    return table.drop_duplicates(columns)
