#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="print")
def printVerb(input: VerbInput, message: str, limit: int = 10):
    output = input.get_input()
    print(message)
    print(output.to_string(max_rows=limit))

    return TableContainer(table=output)
