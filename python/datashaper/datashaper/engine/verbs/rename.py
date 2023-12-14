#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict

from datashaper.engine.verbs.verbs_mapping import verb

from ...table_store import TableContainer
from .verb_input import VerbInput


@verb(name="rename")
def rename(input: VerbInput, columns: Dict[str, str]):
    input_table = input.get_input()
    output = input_table.rename(columns=columns)
    return TableContainer(table=output)
