#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Intersect verb implementation."""

from typing import cast

import pandas as pd

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb


def intersect(
    table: pd.DataFrame, others: list[pd.DataFrame], **_kwargs: dict
) -> pd.DataFrame:
    """Intersect verb implementation."""
    output = table.merge(pd.concat(others), how="left", indicator=True)
    output = output[output["_merge"] == "both"]
    return cast(pd.DataFrame, output.drop("_merge", axis=1).reset_index(drop=True))


apply_decorators(
    [
        verb(name="intersect", immutable_input=True),
        inputs(default_argument_name="table", variadic_argument_name="others"),
        outputs(return_type=OutputReturnType.Table),
    ],
    intersect,
)
