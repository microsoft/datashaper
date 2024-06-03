#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Binarize verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.types import VerbResult
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.verbs import binarize


@verb(name="binarize")
def binarize_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Binarize verb implementation."""
    input_table = cast(pd.DataFrame, input.get_input())
    result = binarize(input_table, **kwargs)
    return create_verb_result(result)
