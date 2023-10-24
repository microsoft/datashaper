#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from ...table_store import TableContainer
from .verb_input import VerbInput


def unorder(input: VerbInput):
    input_table = input.get_input()

    output = input_table.sort_index()
    return TableContainer(table=output)
