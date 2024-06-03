#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Intersect verb implementation."""

from typing import Any

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import (
    VerbResult,
    create_verb_result,
)
from datashaper.verbs import intersect


@verb(name="intersect", treats_input_tables_as_immutable=True)
def intersect_verb(input: VerbInput, **kwargs: Any) -> VerbResult:
    """Intersect verb implementation."""
    result = intersect(input.get_input(), input.get_others(), **kwargs)
    return create_verb_result(result)
