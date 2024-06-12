#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Difference verb implementation."""

from typing import Any, cast

import pandas as pd

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb


def difference(
    table: pd.DataFrame, others: list[pd.DataFrame], **_kwargs: Any
) -> pd.DataFrame:
    """Difference verb implementation."""
    output = table.merge(pd.concat(others), how="left", indicator=True)
    output = output[output["_merge"] == "left_only"]
    return cast(pd.DataFrame, output.drop("_merge", axis=1))


apply_decorators(
    [
        verb(name="difference"),
        inputs(default_argument_name="table", variadic_argument_name="others"),
        outputs(return_type=OutputReturnType.Table),
    ],
    difference,
)
