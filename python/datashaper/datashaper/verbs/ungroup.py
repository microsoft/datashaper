#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Ungroup verb implementation."""

import pandas as pd
from reactivedataflow import InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, wrap_verb_result


@verb(
    name="ungroup",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
    ],
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def ungroup(table: pd.DataFrame) -> pd.DataFrame:
    """Ungroup verb implementation."""
    return table.obj
