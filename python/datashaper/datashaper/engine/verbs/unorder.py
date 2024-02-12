#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unorder verb implementation."""

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import TableContainer


@verb(name="unorder", treats_input_tables_as_immutable=True)
def unorder(input: VerbInput) -> TableContainer:
    """Unorder verb implementation."""
    input_table = input.get_input()

    output = input_table.sort_index()
    return TableContainer(table=output)
