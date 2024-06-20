#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Groupby verb implementation."""

from typing import Any

import pandas as pd
from pandas.core.groupby import DataFrameGroupBy

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="groupby",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def groupby(
    table: pd.DataFrame, columns: list[str], **_kwargs: Any
) -> DataFrameGroupBy:
    """Groupby verb implementation."""
    return table.groupby(by=columns)
