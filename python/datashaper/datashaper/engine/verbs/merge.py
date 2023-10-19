#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from functools import partial
from typing import List

from datashaper.engine.verbs.utils.merge_utils import strategy_mapping
from datashaper.engine.verbs.utils.unhot_utils import unhot_operation
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.table_store import TableContainer
from datashaper.types import MergeStrategy


def merge(
    input: VerbInput,
    to: str,
    columns: List[str],
    strategy: str,
    delimiter: str = "",
    preserveSource: bool = False,
    unhot: bool = False,
    prefix: str = "",
):
    def get_input_table():
        if unhot:
            return unhot_operation(input, columns, prefix).get_input()
        else:
            return input.get_input()

    merge_strategy = MergeStrategy(strategy)
    input_table = get_input_table()
    output = input_table.copy()

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

    return TableContainer(table=output)
