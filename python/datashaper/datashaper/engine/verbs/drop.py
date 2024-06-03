#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Drop verb implementation."""

from typing import Any

from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import drop

from .verb_input import VerbInput


@verb(name="drop")
def drop_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Drop verb implementation."""
    result = drop(input.get_input(), **kwargs)
    return create_verb_result(result)
