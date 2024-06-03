#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Concat verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import concat


@verb(
    name="concat",
    treats_input_tables_as_immutable=True,
)
def concat_verb(input: VerbInput, **kwargs: Any) -> VerbResult:
    """Concat verb implementation."""
    input_table = cast(pd.DataFrame, input.get_input())
    others = cast(list[pd.DataFrame], input.get_others())
    output = concat(input_table, others, **kwargs)
    return create_verb_result(output)
