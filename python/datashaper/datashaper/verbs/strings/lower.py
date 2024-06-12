#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Lower verb implementation."""

import pandas as pd

from datashaper.verbs.decorators import (
    OutputReturnType,
    apply_decorators,
    inputs,
    outputs,
    verb,
)


def lower(table: pd.DataFrame, column: str, to: str, **_kwargs: dict) -> pd.DataFrame:
    """Transform a column by applying a string-lowercase."""
    table[to] = table[column].str.lower()
    return table


apply_decorators(
    [
        verb(name="strings.lower"),
        inputs(default_input_argname="table"),
        outputs(return_type=OutputReturnType.Table),
    ],
    lower,
)
