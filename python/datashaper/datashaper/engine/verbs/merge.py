#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Merge verb implementation."""

from functools import partial
from typing import cast

import polars as pl

from datashaper.engine.types import MergeStrategy
from datashaper.engine.verbs.utils import strategy_mapping
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import (
    Table,
    VerbResult,
    create_verb_result,
)


@verb(name="merge")
def merge(
    input: VerbInput,
    to: str,
    columns: list[str],
    strategy: str,
    delimiter: str = "",
    preserveSource: bool = False,  # noqa: N803
    **_kwargs: dict,
) -> VerbResult:
    """Merge verb implementation."""
    merge_strategy = MergeStrategy(strategy)

    input_table = cast(pl.DataFrame, input.get_input())

    input_table[to] = input_table[columns].apply(
        partial(strategy_mapping[merge_strategy], delim=delimiter)
    )

    if not preserveSource:
        input_table.drop(columns=columns, inplace=True)

    return create_verb_result(cast(Table, input_table))
