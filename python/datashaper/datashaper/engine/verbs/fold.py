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
    preserveSource: bool = False,  # noqa: N803
    **_kwargs: dict,
) -> VerbResult:
    """Fold verb implementation."""
    input_table = input.get_input()
    output = input_table

    # if we want to preserve the source, we'll create temporary copies of the source columns
    # later we'll rename these back, which allows the fold operation to properly use the column
    # names as values in the meantime
    rename_mapper: dict[str, str] = {}
    if preserveSource is True:
        output = output.copy()
        for column in columns:
            output[f"__datashaper_fold_{column}"] = output[column]
            rename_mapper[f"__datashaper_fold_{column}"] = column

    columns = [column for column in output.columns if column not in columns]

    if len(columns) > 0:
        output = output.set_index(columns)

    output = output.stack(dropna=False).reset_index()

    col: str = cast(str, output.filter(regex="level_[1-9]").columns[0])
    output = output.rename({col: to[0], 0: to[1]}, axis=1).reset_index()[
        columns + [to[0], to[1]]
    ]

    if preserveSource is True:
        # (pyright reports a false call issue with the args to rename)
        output.rename(mapper=rename_mapper, axis=1, inplace=True)  # type: ignore

    return create_verb_result(cast(Table, output))
