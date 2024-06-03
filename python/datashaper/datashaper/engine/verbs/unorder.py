#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unorder verb implementation."""

from typing import Any

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import unorder


@verb(name="unorder", treats_input_tables_as_immutable=True)
def unorder_verb(input: VerbInput, **kwargs: Any) -> VerbResult:
    """Unorder verb implementation."""
    result = unorder(input.get_input(), **kwargs)
    return create_verb_result(result)
