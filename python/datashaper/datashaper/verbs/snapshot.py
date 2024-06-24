#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Snapshot verb implementation."""


import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, wrap_verb_result
from .types import FileFormat


@verb(
    name="snapshot",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="name", required=True),
        ConfigPort(name="file_type", required=True),
    ],
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def snapshot(table: pd.DataFrame, name: str, file_type: FileFormat) -> pd.DataFrame:
    """Snapshot verb implementation."""
    file_name = "./" + name + "." + file_type

    if file_type == FileFormat.Csv:
        table.to_csv(file_name)

    if file_type == FileFormat.Json:
        table.to_json(file_name, orient="records", compression="infer")

    if file_type == FileFormat.Parquet:
        table.to_parquet(file_name)

    return table
