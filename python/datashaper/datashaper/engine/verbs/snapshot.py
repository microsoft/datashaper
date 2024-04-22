#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Snapshot verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.types import FileType
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result

from .verb_input import VerbInput


@verb(name="snapshot")
def snapshot(
    input: VerbInput,
    name: str,
    type: FileType,
    **_kwargs: dict,
) -> VerbResult:
    """Snapshot verb implementation."""
    output = cast(pd.DataFrame, input.get_input())
    file_name = name + "." + type

    if format == FileType.Csv:
        output.to_csv(file_name)

    if format == FileType.Json:
        output.to_json(file_name, orient="records", compression="infer")

    if format == FileType.Parquet:
        output.to_parquet(file_name)

    return create_verb_result(output)
