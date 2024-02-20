#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Rollup verb implementation."""
from collections.abc import Iterable

import pandas as pd

from datashaper.engine.pandas import aggregate_operation_mapping
from datashaper.engine.types import FieldAggregateOperation
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="rollup", treats_input_tables_as_immutable=True)
def rollup(
    input: VerbInput,
    column: str,
    to: str,
    operation: str,
    **_kwargs: dict,
) -> VerbResult:
    """Rollup verb implementation."""
    aggregate_operation = FieldAggregateOperation(operation)
    input_table = input.get_input()

    agg_result = input_table[column].agg(
        aggregate_operation_mapping[aggregate_operation]
    )

    if not isinstance(agg_result, Iterable):
        agg_result = [agg_result]
    if isinstance(agg_result, pd.Series):
        agg_result = agg_result.reset_index(drop=True)

    output = pd.DataFrame({to: agg_result})

    return create_verb_result(output)
