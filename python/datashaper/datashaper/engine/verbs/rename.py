#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="rename", treats_input_tables_as_immutable=True)
def rename(input: VerbInput, columns: Dict[str, str]):
    input_table = input.get_input()
    output = input_table.rename(columns=columns)
    return TableContainer(table=output)
