#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unfold verb implementation."""

from typing import cast

import numpy as np
import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, copy_input_tables, wrap_verb_result


@verb(
    name="unfold",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="key", required=True),
        ConfigPort(name="value", required=True),
    ],
    adapters=[
        copy_input_tables("table"),
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def unfold(table: pd.DataFrame, key: str, value: str) -> pd.DataFrame:
    """Unfold verb implementation."""
    columns = len(table[key].unique())

    new_index = np.array(table.index)
    new_index = np.floor_divide(new_index, columns)

    table.index = new_index

    output_temp = table.pivot(columns=key, values=value)
    table.drop(columns=[key, value], axis=1, errors="ignore", inplace=True)
    return pd.concat(
        [cast(pd.DataFrame, table.groupby(level=0).agg("first")), output_temp], axis=1
    )
