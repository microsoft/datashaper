#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Lower verb implementation."""

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper.constants import DEFAULT_INPUT_NAME
from datashaper.verbs.decorators import (
    OutputMode,
    copy_input_tables,
    wrap_verb_result,
)


@verb(
    name="strings.lower",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="column", required=True),
        ConfigPort(name="to", required=True),
    ],
    adapters=[
        copy_input_tables("table"),
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def lower(table: pd.DataFrame, column: str, to: str) -> pd.DataFrame:
    """Transform a column by applying a string-lowercase."""
    table[to] = table[column].str.lower()
    return table
