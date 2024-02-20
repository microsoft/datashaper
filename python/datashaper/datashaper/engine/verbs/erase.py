#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Erase verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="erase")
def erase(
    input: VerbInput,
    column: str,
    value: str | float,
    **_kwargs: dict,
) -> VerbResult:
    """Erase verb implementation."""
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)

    output[column] = output[column].apply(
        lambda df_value: None if df_value == value else df_value
    )

    return create_verb_result(output)
