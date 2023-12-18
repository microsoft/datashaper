#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from datashaper.engine.verbs.verbs_mapping import verb

from ...table_store import TableContainer
from .verb_input import VerbInput


@verb(name="ungroup")
def ungroup(input: VerbInput):
    input_table = input.get_input()
    output = input_table.obj
    return TableContainer(table=output)
