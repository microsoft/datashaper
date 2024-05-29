#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Snapshot verb implementation."""

from typing import cast

import polars as pl

from datashaper.engine.types import FileType
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result

from .verb_input import VerbInput


@verb(name="snapshot")
def snapshot(
    input: VerbInput,
    name: str,
    file_type: FileType,
    **_kwargs: dict,
) -> VerbResult:
    """Snapshot verb implementation."""
    output = cast(pl.DataFrame, input.get_input())
    file_name = "./" + name + "." + file_type

    if file_type == FileType.Csv:
        output.write_csv(file_name)

    if file_type == FileType.Json:
        output.write_json(file_name)

    if file_type == FileType.Parquet:
        output.write_parquet(file_name)

    return create_verb_result(output)
