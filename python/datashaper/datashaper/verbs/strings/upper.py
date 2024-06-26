#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Upper verb implementation."""

import pandas as pd

from datashaper.verbs.decorators import (
    OutputMode,
    apply_decorators,
    inputs,
    outputs,
    verb,
)


def upper(table: pd.DataFrame, column: str, to: str, **_kwargs: dict) -> pd.DataFrame:
    """Upper verb implementation."""
    table[to] = table[column].str.upper()
    return table


apply_decorators(
    [
        verb(name="strings.upper"),
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
    upper,
)
