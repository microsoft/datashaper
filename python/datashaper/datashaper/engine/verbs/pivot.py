#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from datashaper.engine.pandas.aggregate_mapping import (
    aggregate_operation_mapping,
)
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.table_store import TableContainer
from datashaper.types import FieldAggregateOperation


def pivot(input: VerbInput, key: str, value: str, operation: str):
    aggregate_operation = FieldAggregateOperation(operation)

    input_table = input.get_input()

    output = input_table.pivot_table(
        values=value,
        columns=key,
        aggfunc=aggregate_operation_mapping[aggregate_operation],
    )

    return TableContainer(table=output)
