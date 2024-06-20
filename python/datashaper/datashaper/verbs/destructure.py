#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Destructure verb implementation."""

import math
from typing import Any

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="destructure",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def destructure(
    table: pd.DataFrame,
    column: str,
    keys: list[str],
    preserveSource: bool = False,  # noqa: N803
    **_kwargs: Any,
) -> pd.DataFrame:
    """Destructure verb implementation."""
    results = []
    for tuple_result in table.iterrows():
        row = tuple_result[1]
        cleaned_row_dict = {col: row[col] for col in table.columns}
        rest_row_dict = row[column] if row[column] is not None else {}

        if is_null(rest_row_dict):
            rest_row_dict = {}

        filtered_dict = {}

        if len(keys) != 0:
            for index in rest_row_dict:
                if index in keys:
                    filtered_dict[index] = rest_row_dict[index]
        else:
            filtered_dict = rest_row_dict

        results.append({**cleaned_row_dict, **filtered_dict})  # type: ignore

    table = pd.DataFrame(results, index=table.index)

    if not preserveSource:
        table = table.drop(columns=[column])

    return table


def is_null(value: Any) -> bool:
    """Check if value is null or is nan."""

    def is_none() -> bool:
        return value is None

    def is_nan() -> bool:
        return isinstance(value, float) and math.isnan(value)

    return is_none() or is_nan()
