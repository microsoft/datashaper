#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Snapshot verb implementation."""

from typing import Any

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb
from .types import FileFormat


@verb(
    name="snapshot",
    immutable_input=True,
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def snapshot(
    table: pd.DataFrame, name: str, file_type: FileFormat, **_kwargs: Any
) -> pd.DataFrame:
    """Snapshot verb implementation."""
    file_name = "./" + name + "." + file_type

    if file_type == FileFormat.Csv:
        table.to_csv(file_name)

    if file_type == FileFormat.Json:
        table.to_json(file_name, orient="records", compression="infer")

    if file_type == FileFormat.Parquet:
        table.to_parquet(file_name)

    return table
