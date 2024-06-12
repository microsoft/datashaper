#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Print verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb

raw_print = print


def print(  # noqa A001 - use ds verb name
    table: pd.DataFrame, message: str, limit: int = 10, **_kwargs: Any
) -> pd.DataFrame:
    """Print verb implementation."""
    # TODO(Chris): should we use a logger for these instead of prints?
    raw_print(message)  # noqa: T201
    raw_print(table.to_string(max_rows=limit))  # noqa: T201

    return table


apply_decorators(
    [
        verb(name="print", immutable_input=True),
        inputs(default_argument_name="table"),
        outputs(return_type=OutputReturnType.Table),
    ],
    print,
)
