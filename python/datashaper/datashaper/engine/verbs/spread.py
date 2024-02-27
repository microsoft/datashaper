#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Spread verb implementation."""
from typing import cast

import numpy as np
import pandas as pd
from pandas._typing import Axes

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


def __normal_spread(
    input_table: pd.DataFrame, columns: list[str], to: list[str], delimiter: str
) -> pd.DataFrame:
    output = input_table
    for column, new_column_name in zip(columns, to, strict=True):
        new_columns = np.array(
            input_table[column].astype(str).str.split(delimiter).to_list()
        )
        columns = (
            [f"{new_column_name}_{i}" for i in range(1, len(new_columns[0]) + 1)]
            if len(new_columns[0]) > 1
            else [new_column_name]
        )
        new_columns = pd.DataFrame(new_columns, columns=cast(Axes, columns))
        output = pd.concat([output, new_columns], axis=1)

    return output


def __onehot_spread(
    input_table: pd.DataFrame, columns: list[str], to: list[str], delimiter: str
) -> pd.DataFrame:
    output = input_table
    for column, new_column_name in zip(columns, to, strict=True):
        output[column] = output[column].astype(str).str.split(delimiter)
        onehot = output[column].str.join("|").str.get_dummies()
        onehot.columns = [f"{new_column_name}_{val}" for val in onehot.columns]

        output = pd.concat(
            [
                output,
                onehot,
            ],
            axis=1,
        )

    return output


@verb(name="spread")
def spread(
    input: VerbInput,
    column: str,
    to: list[str] | None = None,
    delimiter: str = ",",
    onehot: bool = False,
    preserveSource: bool = False,  # noqa: N803
    **_kwargs: dict,
) -> VerbResult:
    """Spread verb implementation."""
    input_table = cast(pd.DataFrame, input.get_input())
    if to is None:
        to = [column]

    if onehot:
        output = __onehot_spread(input_table, [column], to, delimiter)
    else:
        output = __normal_spread(input_table, [column], to, delimiter)

    if not preserveSource:
        output = output.drop(columns=[column])

    return create_verb_result(output)
