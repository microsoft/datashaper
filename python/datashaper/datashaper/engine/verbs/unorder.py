#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unorder verb implementation."""

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="unorder", treats_input_tables_as_immutable=True)
def unorder(
    input: VerbInput,
    **_kwargs: dict,
) -> VerbResult:
    """Unorder verb implementation."""
    input_table = input.get_input()

    output = input_table.sort_index()
    return create_verb_result(output)
