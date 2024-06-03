#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Snapshot verb implementation."""

from typing import Any

from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import snapshot

from .verb_input import VerbInput


@verb(name="snapshot", treats_input_tables_as_immutable=True)
def snapshot_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Snapshot verb implementation."""
    result = snapshot(input.get_input(), **kwargs)
    return create_verb_result(result)
