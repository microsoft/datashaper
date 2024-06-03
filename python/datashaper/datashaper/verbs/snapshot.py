#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Snapshot verb implementation."""

from typing import Any

import pandas as pd

from datashaper.types import FileType


def snapshot(
    table: pd.DataFrame, name: str, file_type: FileType, **_kwargs: Any
) -> pd.DataFrame:
    """Snapshot verb implementation."""
    file_name = "./" + name + "." + file_type

    if file_type == FileType.Csv:
        table.to_csv(file_name)

    if file_type == FileType.Json:
        table.to_json(file_name, orient="records", compression="infer")

    if file_type == FileType.Parquet:
        table.to_parquet(file_name)

    return table
