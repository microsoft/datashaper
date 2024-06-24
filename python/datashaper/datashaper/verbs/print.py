#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Print verb implementation."""

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, wrap_verb_result

raw_print = print


@verb(
    name="print",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="message", required=True),
    ],
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def print(  # noqa A001 - use ds verb name
    table: pd.DataFrame, message: str, limit: int = 10
) -> pd.DataFrame:
    """Print verb implementation."""
    # TODO(Chris): should we use a logger for these instead of prints?
    raw_print(message)  # noqa: T201
    raw_print(table.to_string(max_rows=limit))  # noqa: T201

    return table
