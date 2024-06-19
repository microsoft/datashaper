#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Drop verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, apply_decorators, inputs, outputs, verb


def drop(table: pd.DataFrame, columns: list[str], **_kwargs: Any) -> pd.DataFrame:
    """Drop verb implementation."""
    return table.drop(columns=columns)


apply_decorators(
    [
        verb(name="drop"),
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
    drop,
)
