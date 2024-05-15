#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Spread verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


def _get_array_item(array: list, index: int) -> Any:
    return array[index] if index < len(array) else None


def _spread(
    table: pd.DataFrame, column: str, to: str | list[str] | None
) -> pd.DataFrame:
    input_col = cast(pd.Series, table[column])
    max_length = cast(int, input_col.apply(len).max())
    num_output_columns = min(max_length, len(to)) if to is not None else max_length
    to_is_array = isinstance(to, list)

    for col in range(num_output_columns):
        col_name = to[col] if to_is_array else f"{to or column}_{col + 1}"
        table[col_name] = input_col.apply(lambda x, col=col: _get_array_item(x, col))

    return table


@verb(name="spread")
def spread(
    input: VerbInput,
    column: str,
    to: str | list[str] | None = None,
    preserveSource: bool = False,  # noqa: N803
    **_kwargs: dict,
) -> VerbResult:
    """Spread verb implementation."""
    input_table = cast(pd.DataFrame, input.get_input())
    output = _spread(input_table, column, to)

    if not preserveSource:
        output = output.drop(columns=[column])

    return create_verb_result(output)
