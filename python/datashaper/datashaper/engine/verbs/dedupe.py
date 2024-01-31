#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="dedupe", treats_input_tables_as_immutable=True)
def dedupe(input: VerbInput, columns: list[str] = None):
    input_table = input.get_input()
    output = input_table.drop_duplicates(columns)
    return TableContainer(table=output)
