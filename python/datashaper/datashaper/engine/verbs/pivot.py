#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Pivot verb implementation."""

from typing import Any

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import pivot


@verb(name="pivot", treats_input_tables_as_immutable=True)
def pivot_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Pivot verb implementation."""
    result = pivot(input.get_input(), **kwargs)
    return create_verb_result(result)
