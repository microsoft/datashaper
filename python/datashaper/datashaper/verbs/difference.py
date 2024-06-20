#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Difference verb implementation."""

from typing import Any, cast

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="difference",
    adapters=[
        inputs(default_input_argname="table", variadic_input_argname="others"),
        outputs(mode=OutputMode.Table),
    ],
)
def difference(
    table: pd.DataFrame, others: list[pd.DataFrame], **_kwargs: Any
) -> pd.DataFrame:
    """Difference verb implementation."""
    output = table.merge(pd.concat(others), how="left", indicator=True)
    output = output[output["_merge"] == "left_only"]
    return cast(pd.DataFrame, output.drop("_merge", axis=1))
