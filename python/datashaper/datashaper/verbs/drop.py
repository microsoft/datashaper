#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Drop verb implementation."""

from typing import Any

import pandas as pd

from datashaper.decorators import verb


@verb(name="drop")
def drop(table: pd.DataFrame, columns: list[str], **_kwargs: Any) -> pd.DataFrame:
    """Drop verb implementation."""
    return table.drop(columns=columns)
