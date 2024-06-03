#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Union verb implementation."""

from typing import Any

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import union


@verb(name="union", treats_input_tables_as_immutable=True)
def union_verb(input: VerbInput, **kwargs: Any) -> VerbResult:
    """Union verb implementation."""
    result = union(input.get_input(), input.get_others(), **kwargs)
    return create_verb_result(result)
