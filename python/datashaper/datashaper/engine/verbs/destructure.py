#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Destructure verb implementation."""

from typing import Any

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.types import VerbResult
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.verbs import destructure


@verb(name="destructure")
def destructure_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Destructure verb implementation."""
    input_table = input.get_input().copy()
    result = destructure(input_table, **kwargs)
    return create_verb_result(result)
