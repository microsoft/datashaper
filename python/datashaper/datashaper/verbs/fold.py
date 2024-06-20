#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Fold verb implementation."""

from typing import Any, cast

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="fold",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def fold(
    table: pd.DataFrame,
    to: tuple[str, str],
    columns: list[str],
    preserveSource: bool = False,  # noqa: N803
    **_kwargs: Any,
) -> pd.DataFrame:
    """Fold verb implementation."""
    # if we want to preserve the source, we'll create temporary copies of the source columns
    # later we'll rename these back, which allows the fold operation to properly use the column
    # names as values in the meantime
    rename_mapper: dict[str, str] = {}
    if preserveSource is True:
        table = table.copy()
        for column in columns:
            table[f"__datashaper_fold_{column}"] = table[column]
            rename_mapper[f"__datashaper_fold_{column}"] = column

    columns = [column for column in table.columns if column not in columns]

    if len(columns) > 0:
        table = table.set_index(columns)

    table = table.stack(dropna=False).reset_index()

    col: str = cast(str, table.filter(regex="level_[1-9]").columns[0])
    table = cast(
        pd.DataFrame,
        table.rename({col: to[0], 0: to[1]}, axis=1).reset_index()[
            columns + [to[0], to[1]]
        ],
    )

    if preserveSource is True:
        # (pyright reports a false call issue with the args to rename)
        table.rename(mapper=rename_mapper, axis=1, inplace=True)  # type: ignore

    return table
