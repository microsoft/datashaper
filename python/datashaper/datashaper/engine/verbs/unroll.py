#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unroll verb implementation."""

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import TableContainer


@verb(name="unroll", treats_input_tables_as_immutable=True)
def unroll(input: VerbInput, column: str) -> TableContainer:
    """Unroll a column."""
    input_table = input.get_input()
    output = input_table.explode(column)
    return TableContainer(table=output)
