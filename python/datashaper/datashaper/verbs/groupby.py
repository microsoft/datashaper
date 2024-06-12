#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Groupby verb implementation."""

from typing import Any

import pandas as pd
from pandas.core.groupby import DataFrameGroupBy

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb


def groupby(
    table: pd.DataFrame, columns: list[str], **_kwargs: Any
) -> DataFrameGroupBy:
    """Groupby verb implementation."""
    return table.groupby(by=columns)


apply_decorators(
    [
        verb(name="groupby"),
        inputs(default_argument_name="table"),
        outputs(return_type=OutputReturnType.Table),
    ],
    groupby,
)
