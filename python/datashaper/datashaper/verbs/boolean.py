#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Boolean verb implementation."""

from typing import Any

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper.constants import DEFAULT_INPUT_NAME

from .decorators import OutputMode, copy_input_tables, wrap_verb_result
from .filter import boolean_function_map
from .types import BooleanLogicalOperator


@verb(
    name="boolean",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="to", required=True),
        ConfigPort(name="columns", required=True),
        ConfigPort(name="operator", required=True),
    ],
    adapters=[
        copy_input_tables("table"),
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def boolean(
    table: pd.DataFrame, to: str, columns: list[str], operator: str, **_kwargs: Any
) -> pd.DataFrame:
    """Boolean verb implementation."""
    logical_operator = BooleanLogicalOperator(operator)
    table[to] = boolean_function_map[logical_operator](table, columns)
    return table
