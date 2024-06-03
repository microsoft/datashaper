#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Bin verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import ds_bin


@verb(name="bin")
def bin_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Bin verb implementation."""
    input_table = cast(pd.DataFrame, input.get_input())
    output = ds_bin(input_table, **kwargs)
    return create_verb_result(output)
