#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from ....table_store import TableContainer
from ..verb_input import VerbInput


def upper(input: VerbInput, column: str, to: str):
    input_table = input.get_input()
    output = input_table.copy()
    output[to] = output[column].str.upper()
    return TableContainer(table=output)
