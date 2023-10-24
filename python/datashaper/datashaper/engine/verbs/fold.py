#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List, Tuple

from ...table_store import TableContainer
from .verb_input import VerbInput


def fold(input: VerbInput, to: Tuple[str, str], columns: List[str]):
    input_table = input.get_input()
    output = input_table.copy()
    columns = [column for column in output.columns if column not in columns]

    if len(columns) > 0:
        output = output.set_index(columns)
    output = output.stack(dropna=False).reset_index()

    output = output.rename(
        {output.filter(regex="level_[1-9]").columns[0]: to[0], 0: to[1]}, axis=1
    ).reset_index()[columns + [to[0], to[1]]]

    return TableContainer(table=output)
