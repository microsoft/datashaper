#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from typing import List

from ...table_store import TableContainer
from .verb_input import VerbInput


def drop(
    input: VerbInput,
    columns: List[str],
):
    filteredList: list[str] = []

    output = input.get_input()

    for col in output.columns:
        try:
            columns.index(col)
        except ValueError:
            filteredList.append(col)

    output = output[filteredList]

    return TableContainer(table=output)
