#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Lookup verb implementation."""

from typing import cast

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, wrap_verb_result


@verb(
    name="lookup",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        InputPort(name="other", required=True),
        ConfigPort(name="columns", required=True),
        ConfigPort(name="on"),
    ],
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def lookup(
    table: pd.DataFrame, other: pd.DataFrame, columns: list[str], on: list[str] | None
) -> pd.DataFrame:
    """Lookup verb implementation."""
    if on is not None and len(on) > 1:
        left_column = on[0]
        right_column = on[1]
        other = cast(pd.DataFrame, other[[right_column] + columns])

        output = table.merge(
            other.drop_duplicates(subset=on, keep="last"),
            left_on=left_column,
            right_on=right_column,
            how="left",
        )
    else:
        if on is not None:
            other = cast(pd.DataFrame, other[on + columns])
        output = table.merge(
            other.drop_duplicates(subset=on, keep="last"),
            on=on,
            how="left",
        )

    return output
