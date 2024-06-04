#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Groupby verb implementation."""

from typing import Any

import pandas as pd
from pandas.core.groupby import DataFrameGroupBy

from datashaper.decorators import verb


@verb(name="groupby", treats_input_tables_as_immutable=True)
def groupby(
    table: pd.DataFrame, columns: list[str], **_kwargs: Any
) -> DataFrameGroupBy:
    """Groupby verb implementation."""
    return table.groupby(by=columns)
