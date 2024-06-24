#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Concat verb implementation."""

import pandas as pd
from reactivedataflow import ArrayInputPort, InputPort, verb

from datashaper.constants import DEFAULT_INPUT_NAME

from .decorators import OutputMode, wrap_verb_result


@verb(
    name="concat",
    immutable_input=True,
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ArrayInputPort(name="others", required=True),
    ],
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def concat(table: pd.DataFrame, others: list[pd.DataFrame]) -> pd.DataFrame:
    """Concat verb implementation."""
    return pd.concat([table] + others, ignore_index=True)
