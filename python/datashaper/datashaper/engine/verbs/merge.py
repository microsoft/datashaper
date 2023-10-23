#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from functools import partial
from typing import List

from ...table_store import TableContainer
from ..types import MergeStrategy
from .utils.merge_utils import __strategy_mapping
from .utils.unhot_utils import unhot_operation
from .verb_input import VerbInput


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
    merge_strategy = MergeStrategy(strategy)

    input_table = (
        unhot_operation(input, columns, prefix).get_input()
        if unhot
        else input.get_input()
    )

    output = input_table.copy()

    output[to] = output[columns].apply(
        partial(__strategy_mapping[merge_strategy], delim=delimiter), axis=1
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
