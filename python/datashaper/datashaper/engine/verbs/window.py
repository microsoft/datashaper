#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Window verb implementation."""

from typing import Any

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.types import VerbResult
from datashaper.verbs import window


@verb(name="window")
def window_verb(input: VerbInput, **kwargs: Any) -> VerbResult:
    """Apply a window function to a column in a table."""
    result = window(input.get_input(), **kwargs)
    return create_verb_result(result)
