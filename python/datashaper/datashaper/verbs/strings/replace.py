#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Replace verb implementation."""

import re

import pandas as pd

from datashaper.verbs.decorators import (
    OutputReturnType,
    apply_decorators,
    inputs,
    outputs,
    verb,
)


def replace(
    table: pd.DataFrame,
    column: str,
    to: str,
    pattern: str,
    replacement: str,
    globalMatch: bool = False,  # noqa: N803
    caseInsensitive: bool = False,  # noqa: N803
    **_kwargs: dict,
) -> pd.DataFrame:
    """Replace verb implementation."""
    n = 0 if globalMatch else 1
    pat = re.compile(pattern, flags=re.IGNORECASE if caseInsensitive else 0)
    table[to] = table[column].apply(lambda x: pat.sub(replacement, x, count=n))
    return table


apply_decorators(
    [
        verb(name="strings.replace"),
        inputs(default_input_argname="table"),
        outputs(return_type=OutputReturnType.Table),
    ],
    replace,
)
