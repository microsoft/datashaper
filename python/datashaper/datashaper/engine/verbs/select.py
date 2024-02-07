#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Select verb implementation."""
from typing import cast

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import Table, TableContainer


@verb(name="select", treats_input_tables_as_immutable=True)
def select(input: VerbInput, columns: list[str]):
    """Select verb implementation."""
    input_table = input.get_input()
    output = cast(Table, input_table[columns])
    return TableContainer(table=output)
