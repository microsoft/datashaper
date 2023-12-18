#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from datashaper.engine.verbs.verbs_mapping import verb

from ...table_store import TableContainer
from .verb_input import VerbInput


@verb(name="dedupe")
def dedupe(input: VerbInput, columns: List[str] = None):
    input_table = input.get_input()
    output = input_table.drop_duplicates(columns)
    return TableContainer(table=output)
