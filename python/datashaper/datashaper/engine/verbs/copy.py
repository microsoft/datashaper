#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Copy verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import copy

from .verb_input import VerbInput


@verb(name="copy")
def copy_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Copy verb implementation."""
    table = cast(pd.DataFrame, input.get_input())
    result = copy(table, **kwargs)
    return create_verb_result(result)
