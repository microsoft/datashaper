#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Drop verb implementation."""
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result

from .verb_input import VerbInput


@verb(name="drop")
def drop(
    input: VerbInput,
    columns: list[str],
    **_kwargs: dict,
) -> VerbResult:
    """Drop verb implementation."""
    output = input.get_input()
    output = output.drop(columns=columns)

    return create_verb_result(output)
