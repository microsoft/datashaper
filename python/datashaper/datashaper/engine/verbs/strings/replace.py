#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from ....table_store import TableContainer
from ..verb_input import VerbInput


def replace(input: VerbInput, column: str, to: str, pattern: str, replacement: str, flags: str = None):
    n = 1
    case = True
    if flags is not None:
        if "g" in flags:
            n = -1
        if "i" in flags:
            case = False
    input_table = input.get_input()
    output = input_table.copy()
    output[to] = output[column].str.replace(pat=pattern, repl=replacement, n=n, case=case)
    return TableContainer(table=output)
