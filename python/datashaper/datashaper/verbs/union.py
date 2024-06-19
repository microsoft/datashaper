#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Union verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, apply_decorators, inputs, outputs, verb


def union(
    table: pd.DataFrame, others: list[pd.DataFrame], **_kwargs: Any
) -> pd.DataFrame:
    """Union verb implementation."""
    return pd.concat([table, *others], ignore_index=True).drop_duplicates()


apply_decorators(
    [
        verb(name="union", immutable_input=True),
        inputs(default_input_argname="table", variadic_input_argname="others"),
        outputs(mode=OutputMode.Table),
    ],
    union,
)
