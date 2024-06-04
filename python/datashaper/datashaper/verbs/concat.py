#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Concat verb implementation."""

from typing import Any

import pandas as pd

from datashaper.decorators import verb


@verb(
    name="concat",
    treats_input_tables_as_immutable=True,
)
def concat(
    table: pd.DataFrame, others: list[pd.DataFrame], **_kwargs: Any
) -> pd.DataFrame:
    """Concat verb implementation."""
    return pd.concat([table] + others, ignore_index=True)
