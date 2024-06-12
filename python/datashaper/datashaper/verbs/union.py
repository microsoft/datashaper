#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Union verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb


def union(
    table: pd.DataFrame, others: list[pd.DataFrame], **_kwargs: Any
) -> pd.DataFrame:
    """Union verb implementation."""
    return pd.concat([table, *others], ignore_index=True).drop_duplicates()


apply_decorators(
    [
        verb(name="union", immutable_input=True),
        inputs(default_argument_name="table", variadic_argument_name="others"),
        outputs(return_type=OutputReturnType.Table),
    ],
    union,
)
