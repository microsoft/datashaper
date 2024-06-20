#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Lookup verb implementation."""

from typing import Any, cast

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="lookup",
    immutable_input=True,
    adapters=[
        inputs(default_input_argname="table", input_argnames={"other": "other"}),
        outputs(mode=OutputMode.Table),
    ],
)
def lookup(
    table: pd.DataFrame,
    other: pd.DataFrame,
    columns: list[str],
    on: list[str] | None = None,
    **_kwargs: Any,
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
