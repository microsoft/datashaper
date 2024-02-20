#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Concat verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(
    name="concat",
    treats_input_tables_as_immutable=True,
)
def concat(
    input: VerbInput,
    **_kwargs: dict,
) -> VerbResult:
    """Concat verb implementation."""
    input_table = cast(pd.DataFrame, input.get_input())
    others = cast(list[pd.DataFrame], input.get_others())
    output = pd.concat([input_table] + others, ignore_index=True)
    return create_verb_result(output)
