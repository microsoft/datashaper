#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Ungroup verb implementation."""

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="ungroup", treats_input_tables_as_immutable=True)
def ungroup(
    input: VerbInput,
    **_kwargs: dict,
) -> VerbResult:
    """Ungroup verb implementation."""
    input_table = input.get_input()
    output = input_table.obj
    return create_verb_result(output)
