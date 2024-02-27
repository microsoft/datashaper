#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Fold verb implementation."""
from typing import cast

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import (
    Table,
    VerbResult,
    create_verb_result,
)


@verb(name="fold")
def fold(
    input: VerbInput,
    to: tuple[str, str],
    columns: list[str],
    **_kwargs: dict,
) -> VerbResult:
    """Fold verb implementation."""
    input_table = input.get_input()
    output = input_table
    columns = [column for column in output.columns if column not in columns]

    if len(columns) > 0:
        output = output.set_index(columns)
    output = output.stack(dropna=False).reset_index()

    col: str = cast(str, output.filter(regex="level_[1-9]").columns[0])
    output = output.rename({col: to[0], 0: to[1]}, axis=1).reset_index()[
        columns + [to[0], to[1]]
    ]

    return create_verb_result(cast(Table, output))
