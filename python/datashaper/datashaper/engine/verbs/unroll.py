#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from ...table_store import TableContainer
from .verb_input import VerbInput


def unroll(input: VerbInput, column: str):
    input_table = input.get_input()
    output = input_table.explode(column)
    return TableContainer(table=output)
