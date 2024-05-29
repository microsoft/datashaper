#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Binarize verb implementation."""

from typing import Any, cast

import polars as pl

from datashaper.engine.pandas import filter_df, get_operator
from datashaper.engine.types import (
    Criteria,
    FilterArgs,
    FilterCompareType,
    StringComparisonOperator,
)
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="binarize")
def binarize(
    input: VerbInput,
    to: str,
    column: str,
    criteria: dict,
    **_kwargs: dict,
) -> VerbResult:
    """Binarize verb implementation."""
    filter_criteria = Criteria(
        value=criteria.get("value"),
        type=FilterCompareType(criteria.get("type", FilterCompareType.Value.value)),
        operator=get_operator(
            criteria.get("operator", StringComparisonOperator.Equals.value)
        ),
    )

    input_table = cast(pl.DataFrame, input.get_input())

    filter_result = filter_df(input_table, FilterArgs(column, filter_criteria))
    output = input_table
    output[to] = filter_result.map(cast(Any, {True: 1, False: 0}), na_action="ignore")

    return create_verb_result(output)
