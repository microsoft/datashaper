#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Replace verb implementation."""

import re

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper.constants import DEFAULT_INPUT_NAME
from datashaper.verbs.decorators import (
    OutputMode,
    copy_input_tables,
    wrap_verb_result,
)


@verb(
    name="strings.replace",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="column", required=True),
        ConfigPort(name="to", required=True),
        ConfigPort(name="pattern", required=True),
        ConfigPort(name="replacement", required=True),
        ConfigPort(name="globalMatch"),
        ConfigPort(name="caseInsensitive"),
    ],
    adapters=[
        copy_input_tables("table"),
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def replace(
    table: pd.DataFrame,
    column: str,
    to: str,
    pattern: str,
    replacement: str,
    globalMatch: bool = False,  # noqa: N803
    caseInsensitive: bool = False,  # noqa: N803
) -> pd.DataFrame:
    """Replace verb implementation."""
    n = 0 if globalMatch else 1
    pat = re.compile(pattern, flags=re.IGNORECASE if caseInsensitive else 0)
    table[to] = table[column].apply(lambda x: pat.sub(replacement, x, count=n))
    return table
