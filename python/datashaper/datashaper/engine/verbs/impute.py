#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Impute verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="impute")
def impute(
    input: VerbInput,
    column: str,
    value: str | float | bool,
    **_kwargs: dict,
) -> VerbResult:
    """Impute verb implementation."""
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)
    output[column] = cast(pd.Series, output[column].fillna(value))
    return create_verb_result(output)
