#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Aggregate verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.types import VerbResult
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.verbs import aggregate


@verb(name="aggregate", treats_input_tables_as_immutable=True)
def aggregate_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Aggregate verb implementation."""
    input_table = cast(pd.DataFrame, input.get_input())
    result = aggregate(input_table, **kwargs)
    return create_verb_result(result)
