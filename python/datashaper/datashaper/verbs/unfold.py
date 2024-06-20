#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unfold verb implementation."""

from typing import Any, cast

import numpy as np
import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="unfold",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def unfold(table: pd.DataFrame, key: str, value: str, **_kwargs: Any) -> pd.DataFrame:
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
