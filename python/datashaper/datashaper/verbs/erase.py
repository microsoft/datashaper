#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Erase verb implementation."""

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, copy_input_tables, wrap_verb_result


@verb(
    name="erase",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="column", required=True),
        ConfigPort(name="value", required=True),
    ],
    adapters=[
        copy_input_tables("table"),
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def erase(table: pd.DataFrame, column: str, value: str | float) -> pd.DataFrame:
    """Erase verb implementation."""
    table[column] = table[column].apply(
        lambda df_value: None if df_value == value else df_value
    )
    return table
