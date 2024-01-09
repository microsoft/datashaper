#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="strings.lower")
def lower(input: VerbInput, column: str, to: str):
    input_table = input.get_input()
    output = input_table
    output[to] = output[column].str.lower()
    return TableContainer(table=output)
