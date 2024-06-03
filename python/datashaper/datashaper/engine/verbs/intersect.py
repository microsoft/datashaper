#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Intersect verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.types import VerbResult
from datashaper.verbs import intersect


@verb(name="intersect", treats_input_tables_as_immutable=True)
def intersect_verb(input: VerbInput, **kwargs: Any) -> VerbResult:
    """Intersect verb implementation."""
    result = intersect(
        cast(pd.DataFrame, input.get_input()),
        cast(list[pd.DataFrame], input.get_others()),
        **kwargs,
    )
    return create_verb_result(result)
