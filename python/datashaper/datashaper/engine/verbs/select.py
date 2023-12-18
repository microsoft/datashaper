#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from datashaper.engine.verbs.verbs_mapping import verb

from ...engine.verbs.verb_input import VerbInput
from ...table_store import TableContainer


@verb(name="select")
def select(input: VerbInput, columns: List[str]):
    input_table = input.get_input()

    output = input_table.copy()
    output = input_table[columns]
    return TableContainer(table=output)
