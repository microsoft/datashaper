#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Pivot verb implementation."""
from datashaper.engine.pandas import aggregate_operation_mapping
from datashaper.engine.types import FieldAggregateOperation
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="pivot", treats_input_tables_as_immutable=True)
def pivot(
    input: VerbInput,
    key: str,
    value: str,
    operation: str,
    **_kwargs: dict,
) -> VerbResult:
    """Pivot verb implementation."""
    aggregate_operation = FieldAggregateOperation(operation)

    input_table = input.get_input()

    output = input_table.pivot_table(
        values=value,
        columns=key,
        aggfunc=aggregate_operation_mapping[aggregate_operation],
    )

    return create_verb_result(output)
