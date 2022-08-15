#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.table_store import TableContainer


def unroll(input: VerbInput, columns: List[str]):
    input_table = input.get_input()
    output = input_table.explode(columns)
    return TableContainer(table=output)
