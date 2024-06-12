#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Select verb implementation."""

from typing import Any, cast

import pandas as pd

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb


def select(table: pd.DataFrame, columns: list[str], **_kwargs: Any) -> pd.DataFrame:
    """Select verb implementation."""
    return cast(pd.DataFrame, table[columns])


apply_decorators(
    [
        verb(name="select", immutable_input=True),
        inputs(default_input_argname="table"),
        outputs(return_type=OutputReturnType.Table),
    ],
    select,
)
