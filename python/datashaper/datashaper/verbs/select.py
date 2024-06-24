#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Select verb implementation."""

from typing import Any, cast

import pandas as pd

from .decorators import OutputMode, inputs, verb, wrap_verb_result


@verb(
    name="select",
    immutable_input=True,
    adapters=[
        inputs(default_input_argname="table"),
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def select(table: pd.DataFrame, columns: list[str], **_kwargs: Any) -> pd.DataFrame:
    """Select verb implementation."""
    return cast(pd.DataFrame, table[columns])
