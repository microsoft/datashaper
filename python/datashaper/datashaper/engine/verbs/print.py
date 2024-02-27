#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Print verb implementation."""
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="print")
def print_verb(
    input: VerbInput,
    message: str,
    limit: int = 10,
    **_kwargs: dict,
) -> VerbResult:
    """Print verb implementation."""
    output = input.get_input()

    # TODO(Chris): should we use a logger for these instead of prints?
    print(message)  # noqa: T201
    print(output.to_string(max_rows=limit))  # noqa: T201

    return create_verb_result(output)
