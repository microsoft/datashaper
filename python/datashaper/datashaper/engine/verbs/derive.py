#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Derive verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.types import VerbResult
from datashaper.verbs import derive


@verb(name="derive")
def derive_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Derive verb implementation."""
    input_table = cast(pd.DataFrame, input.get_input())
    result = derive(input_table, **kwargs)
    return create_verb_result(result)
