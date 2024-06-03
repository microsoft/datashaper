#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Onehot verb implementation."""

from typing import Any

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import onehot


@verb(name="onehot")
def onehot_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Onehot verb implementation."""
    result = onehot(input.get_input(), **kwargs)
    return create_verb_result(result)
