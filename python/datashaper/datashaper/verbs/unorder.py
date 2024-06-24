#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unorder verb implementation."""

import pandas as pd
from reactivedataflow import InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, wrap_verb_result


@verb(
    name="unorder",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
    ],
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def unorder(table: pd.DataFrame) -> pd.DataFrame:
    """Unorder verb implementation."""
    return table.sort_index()
