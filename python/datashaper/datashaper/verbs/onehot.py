#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Onehot verb implementation."""

import numpy as np
import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, copy_input_tables, wrap_verb_result


@verb(
    name="onehot",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="column", required=True),
        ConfigPort(name="prefix"),
        ConfigPort(name="preserveSource"),
    ],
    adapters=[
        copy_input_tables("table"),
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def onehot(
    table: pd.DataFrame,
    column: str,
    prefix: str = "",
    preserveSource: bool = False,  # noqa: N803
) -> pd.DataFrame:
    """Onehot verb implementation."""
    table[column] = table[column].astype("category")

    dummies = pd.get_dummies(table[[column]], prefix=[prefix], prefix_sep="")
    cols = dummies.columns.str.startswith(prefix)
    dummies.loc[table[column].isna(), cols] = np.nan

    output = pd.concat([table, dummies], axis=1)
    if not preserveSource:
        output = output.drop(columns=column)

    return output
