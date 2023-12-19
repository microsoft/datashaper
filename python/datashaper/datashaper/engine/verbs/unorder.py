#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="unorder")
def unorder(input: VerbInput):
    input_table = input.get_input()

    output = input_table.sort_index()
    return TableContainer(table=output)
