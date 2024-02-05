#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from functools import partial
from typing import cast

import pandas as pd

from datashaper.engine.types import MergeStrategy
from datashaper.engine.verbs.utils import strategy_mapping, unhot_operation
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import Table, TableContainer


@verb(name="merge")
def merge(
    input: VerbInput,
    to: str,
    columns: list[str],
    strategy: str,
    delimiter: str = "",
    preserveSource: bool = False,
    unhot: bool = False,
    prefix: str = "",
):
    merge_strategy = MergeStrategy(strategy)

    input_table = (
        unhot_operation(input, columns, prefix).get_input()
        if unhot
        else input.get_input()
    )

    output = cast(pd.DataFrame, input_table)

    output[to] = output[columns].apply(
        partial(strategy_mapping[merge_strategy], delim=delimiter), axis=1
    )

    filteredList: list[str] = []

    for col in output.columns:
        try:
            columns.index(col)
        except ValueError:
            filteredList.append(col)

    if not preserveSource:
        output = output[filteredList]

    return TableContainer(table=cast(Table, output))
