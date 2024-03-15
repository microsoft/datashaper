#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Aggregate verb implementation."""

from typing import cast

import pandas as pd

from datashaper.engine.pandas import aggregate_operation_mapping
from datashaper.engine.types import FieldAggregateOperation
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="aggregate", treats_input_tables_as_immutable=True)
def aggregate(
    input: VerbInput,
    to: str,
    groupby: list[str],
    column: str,
    operation: FieldAggregateOperation,
    **_kwargs: dict,
) -> VerbResult:
    """Aggregate verb implementation."""
    result = cast(
        pd.DataFrame,
        (
            input.get_input()
            .groupby(groupby)
            .agg({column: aggregate_operation_mapping[operation]})
        ),
    )
    result[to] = result[column]
    result.drop(column, axis=1, inplace=True)

    return create_verb_result(table=result.reset_index())
