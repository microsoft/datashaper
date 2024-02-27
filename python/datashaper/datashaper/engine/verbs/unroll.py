#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unroll verb implementation."""

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="unroll", treats_input_tables_as_immutable=True)
def unroll(
    input: VerbInput,
    column: str,
    **_kwargs: dict,
) -> VerbResult:
    """Unroll a column."""
    input_table = input.get_input()
    output = input_table.explode(column)
    return create_verb_result(output)
