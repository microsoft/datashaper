#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Ungroup verb implementation."""

from typing import Any

import pandas as pd

from datashaper.decorators import verb


@verb(name="ungroup", treats_input_tables_as_immutable=True)
def ungroup(table: pd.DataFrame, **_kwargs: Any) -> pd.DataFrame:
    """Ungroup verb implementation."""
    return table.obj
