#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unorder verb implementation."""

from typing import Any

import pandas as pd

from datashaper.decorators import verb


@verb(name="unorder", treats_input_tables_as_immutable=True)
def unorder(table: pd.DataFrame, **_kwargs: Any) -> pd.DataFrame:
    """Unorder verb implementation."""
    return table.sort_index()
