#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Destructure verb implementation."""

import math
from typing import Any

import polars as pl

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="destructure")
def destructure(
    input: VerbInput,
    column: str,
    keys: list[str],
    preserveSource: bool = False,  # noqa: N803
    **_kwargs: dict,
) -> VerbResult:
    """Destructure verb implementation."""
    input_table = input.get_input()

    results = []
    for tuple_result in input_table.iter_rows():
        row = tuple_result[1]
        cleaned_row_dict = {col: row[col] for col in input_table.columns}
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

    input_table = pl.DataFrame(results)

    if not preserveSource:
        input_table = input_table.drop(columns=[column])

    return create_verb_result(input_table)


def is_null(value: Any) -> bool:
    """Check if value is null or is nan."""

    def is_none() -> bool:
        return value is None

    def is_nan() -> bool:
        return isinstance(value, float) and math.isnan(value)

    return is_none() or is_nan()
