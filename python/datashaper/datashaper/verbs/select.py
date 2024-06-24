#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Select verb implementation."""

from typing import cast

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, wrap_verb_result


@verb(
    name="select",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="columns", required=True),
    ],
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def select(table: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    """Select verb implementation."""
    return cast(pd.DataFrame, table[columns])
