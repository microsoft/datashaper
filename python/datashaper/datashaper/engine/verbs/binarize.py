#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Binarize verb implementation."""
from typing import Any, cast

import pandas as pd

from datashaper.engine.pandas import filter_df, get_operator
from datashaper.engine.types import (
    Criteria,
    FilterArgs,
    FilterCompareType,
)
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="binarize")
def binarize(
    input: VerbInput,
    to: str,
    column: str,
    criteria: Criteria,
    **_kwargs: dict,
) -> VerbResult:
    """Binarize verb implementation."""
    filter_criteria = Criteria(
        value=criteria.value | None,
        type=FilterCompareType(criteria.type),
        operator=get_operator(criteria.operator),
    )

    input_table = cast(pd.DataFrame, input.get_input())

    filter_result = filter_df(input_table, FilterArgs(column, filter_criteria))
    output = input_table
    output[to] = filter_result.map(cast(Any, {True: 1, False: 0}), na_action="ignore")

    return create_verb_result(output)
