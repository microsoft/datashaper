#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Groupby verb implementation."""
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="groupby", treats_input_tables_as_immutable=True)
def groupby(
    input: VerbInput,
    columns: list[str],
    **_kwargs: dict,
) -> VerbResult:
    """Groupby verb implementation."""
    input_table = input.get_input()
    output = input_table.groupby(by=columns)
    return create_verb_result(output)
