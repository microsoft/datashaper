#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Lookup verb implementation."""

from typing import cast

import polars as pl

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="lookup", treats_input_tables_as_immutable=True)
def lookup(
    input: VerbInput,
    columns: list[str],
    on: list[str] | None = None,
    **_kwargs: dict,
) -> VerbResult:
    """Lookup verb implementation."""
    input_table: pl.DataFrame = cast(pl.DataFrame, input.get_input())
    other_table: pl.DataFrame = cast(pl.DataFrame, input.get_others()[0])

    if on is not None and len(on) > 1:
        left_column = on[0]
        right_column = on[1]
        other_table = cast(pl.DataFrame, other_table[[right_column] + columns])

        output = input_table.join(
            other_table.drop_duplicates(subset=on, keep="last"),
            left_on=left_column,
            right_on=right_column,
            how="left",
        )
    else:
        if on is not None:
            other_table = cast(pl.DataFrame, other_table[on + columns])
        output = input_table.join(
            other_table.drop_duplicates(subset=on, keep="last"),
            on=on,
            how="left",
        )

    return create_verb_result(output)
