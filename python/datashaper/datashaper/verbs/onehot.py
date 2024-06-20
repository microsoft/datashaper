#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Onehot verb implementation."""

from typing import Any

import numpy as np
import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="onehot",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def onehot(
    table: pd.DataFrame,
    column: str,
    prefix: str = "",
    preserveSource: bool = False,  # noqa: N803
    **_kwargs: Any,
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
