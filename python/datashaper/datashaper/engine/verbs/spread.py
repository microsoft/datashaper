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

from .utils.type_utils import to_array_column

_ONEHOT_ONLY_ACCEPTS_SINGLE_TO = "Onehot only accepts a single 'to' column."


def _get_array_item(array: list, index: int) -> Any:
    return array[index] if index < len(array) else None


def __normal_spread(
    table: pd.DataFrame, column: str, to: str | list[str] | None, delimiter: str
) -> pd.DataFrame:
    input_col = to_array_column(cast(pd.Series, table[column]), delimiter)
    max_length = cast(int, input_col.apply(len).max())
    num_output_columns = min(max_length, len(to)) if to is not None else max_length
    to_is_array = isinstance(to, list)

    for col in range(num_output_columns):
        col_name = to[col] if to_is_array else f"{to or column}_{col + 1}"
        table[col_name] = input_col.apply(lambda x, col=col: _get_array_item(x, col))

    return table


def __onehot_spread(
    table: pd.DataFrame, column: str, to: str | None, delimiter: str
) -> pd.DataFrame:
    input_col = to_array_column(cast(pd.Series, table[column]), delimiter)
    onehot = input_col.str.join("|").str.get_dummies()

    for column_name in onehot.columns:
        output_column_name = f"{to or column}_{column_name}"
        table[output_column_name] = onehot[column_name]

    return table


@verb(name="spread")
def spread(
    input: VerbInput,
    column: str,
    to: str | list[str] | None = None,
    delimiter: str = ",",
    onehot: bool = False,
    preserveSource: bool = False,  # noqa: N803
    **_kwargs: dict,
) -> VerbResult:
    """Spread verb implementation."""
    input_table = cast(pd.DataFrame, input.get_input())
    if onehot:
        if isinstance(to, list):
            raise ValueError(_ONEHOT_ONLY_ACCEPTS_SINGLE_TO)
        output = __onehot_spread(input_table, column, to, delimiter)
    else:
        output = __normal_spread(input_table, column, to, delimiter)

    if not preserveSource:
        output = output.drop(columns=[column])

    return create_verb_result(output)
