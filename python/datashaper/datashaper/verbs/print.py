#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Print verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb

raw_print = print


@verb(
    name="print",
    immutable_input=True,
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def print(  # noqa A001 - use ds verb name
    table: pd.DataFrame, message: str, limit: int = 10, **_kwargs: Any
) -> pd.DataFrame:
    """Print verb implementation."""
    # TODO(Chris): should we use a logger for these instead of prints?
    raw_print(message)  # noqa: T201
    raw_print(table.to_string(max_rows=limit))  # noqa: T201

    return table
