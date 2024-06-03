#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Convert verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.types import VerbResult
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.verbs import convert


@verb(name="convert")
def convert_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Convert verb implementation."""
    input_table = cast(pd.DataFrame, input.get_input())
    output = convert(input_table, **kwargs)
    output = cast(pd.DataFrame, input_table)
    return create_verb_result(output)
