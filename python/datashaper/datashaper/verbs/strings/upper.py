#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Upper verb implementation."""

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper.constants import DEFAULT_INPUT_NAME
from datashaper.verbs.decorators import (
    OutputMode,
    copy_input_tables,
    wrap_verb_result,
)


@verb(
    name="strings.upper",
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
def upper(table: pd.DataFrame, column: str, to: str) -> pd.DataFrame:
    """Upper verb implementation."""
    table[to] = table[column].str.upper()
    return table
