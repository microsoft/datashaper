#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from datashaper.engine.pandas import aggregate_operation_mapping
from datashaper.engine.types import FieldAggregateOperation
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="aggregate", treats_input_tables_as_immutable=True)
def aggregate(
    input: VerbInput, to: str, groupby: List[str], column: str, operation: str
) -> TableContainer:
    aggregate_operation = FieldAggregateOperation(operation)
    input_table = input.get_input()
    output = (
        input_table[[groupby, column]]
        .groupby(groupby)
        .agg(aggregate_operation_mapping[aggregate_operation])
    )
    output.columns = [to]
    return TableContainer(table=output.reset_index())
