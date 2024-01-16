#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from datashaper.engine.verbs.verbs_mapping import verb

from ...table_store import TableContainer
from .verb_input import VerbInput


@verb(name="noop")
def noop(
    input: VerbInput,
    message: str,
):
    output = input.get_input()
    print(message)
    print(output.to_string())

    return TableContainer(table=output)
