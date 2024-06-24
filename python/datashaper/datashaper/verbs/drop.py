#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Drop verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, inputs, verb, wrap_verb_result


@verb(
    name="drop",
    adapters=[
        inputs(default_input_argname="table"),
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def drop(table: pd.DataFrame, columns: list[str], **_kwargs: Any) -> pd.DataFrame:
    """Drop verb implementation."""
    return table.drop(columns=columns)
