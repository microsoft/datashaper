#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Union

from ...table_store import TableContainer
from .verb_input import VerbInput


def fill(
    input: VerbInput,
    to: str,
    value: Union[str, int, float, bool],
):
    input_table = input.get_input()
    output = input_table.copy()
    output[to] = value
    return TableContainer(table=output)
