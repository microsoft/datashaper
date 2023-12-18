#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from datashaper.engine.verbs.verbs_mapping import verb

from ...table_store import TableContainer
from .verb_input import VerbInput


@verb(name="copy")
def copy(
    input: VerbInput,
    to: str,
    column: str,
):
    output = input.get_input()
    output[to] = output[column]

    return TableContainer(table=output)
