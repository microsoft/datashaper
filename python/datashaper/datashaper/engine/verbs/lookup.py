#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Lookup verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.types import VerbResult
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.verbs import lookup


@verb(name="lookup", treats_input_tables_as_immutable=True)
def lookup_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Lookup verb implementation."""
    result = lookup(
        cast(pd.DataFrame, cast(pd.DataFrame, input.get_input())),
        cast(pd.DataFrame, input.get_others()[0]),
        **kwargs,
    )
    return create_verb_result(result)
