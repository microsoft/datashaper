#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Dedupe verb implementation."""

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, wrap_verb_result


@verb(
    name="dedupe",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="columns", required=False),
    ],
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def dedupe(table: pd.DataFrame, columns: list[str] | None = None) -> pd.DataFrame:
    """Dedupe verb implementation."""
    return table.drop_duplicates(columns)
