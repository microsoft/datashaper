#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Rename verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, inputs, verb, wrap_verb_result


@verb(
    name="rename",
    adapters=[
        inputs(default_input_argname="table"),
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def rename(
    table: pd.DataFrame, columns: dict[str, str], **_kwargs: Any
) -> pd.DataFrame:
    """Rename verb implementation."""
    return table.rename(columns=columns)
