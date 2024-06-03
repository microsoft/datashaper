#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Dedupe verb implementation."""

from typing import Any

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import dedupe


@verb(name="dedupe", treats_input_tables_as_immutable=True)
def dedupe_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Dedupe verb implementation."""
    input_table = input.get_input()
    result = dedupe(input_table, **kwargs)
    return create_verb_result(result)
