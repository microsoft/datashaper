#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Recode verb implementation."""

from typing import Any, cast

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, copy_input_tables, wrap_verb_result


class RecodeMap(dict):
    """Recode map class."""

    def __missing__(self, key: str):
        """Return the key if it is not found in the mapping."""
        return key


@verb(
    name="recode",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="to", required=True),
        ConfigPort(name="column", required=True),
        ConfigPort(name="mapping", required=True),
    ],
    adapters=[
        copy_input_tables("table"),
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def recode(table: pd.DataFrame, to: str, column: str, mapping: dict) -> pd.DataFrame:
    """Recode verb implementation."""
    mapping = RecodeMap(mapping)
    table[to] = table[column].map(cast(Any, mapping))
    return table
