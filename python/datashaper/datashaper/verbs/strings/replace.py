#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Replace verb implementation."""

import re

import pandas as pd

from datashaper.verbs.decorators import VerbInputSpec, verb


@verb(name="strings.replace", input=VerbInputSpec("table"))
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
