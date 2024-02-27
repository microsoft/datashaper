#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Fill verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="fill")
def fill(
    input: VerbInput,
    to: str,
    value: str | float | bool,
    **_kwargs: dict,
) -> VerbResult:
    """Fill verb implementation."""
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)
    output[to] = value
    return create_verb_result(output)
