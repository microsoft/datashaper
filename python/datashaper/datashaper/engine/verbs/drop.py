#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from typing import List

from datashaper.engine.verbs.verbs_mapping import verb

from ...table_store import TableContainer
from .verb_input import VerbInput


@verb(name="drop")
def drop(
    input: VerbInput,
    columns: List[str],
):
    output = input.get_input()
    output = output.drop(columns=columns)

    return TableContainer(table=output)
