#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from data_wrangling_components.engine.pandas.aggregate_mapping import (
    aggregate_operation_mapping,
)
from data_wrangling_components.table_store import TableContainer
from data_wrangling_components.types import FieldAggregateOperation


def aggregate(
    input: TableContainer, to: str, groupby: List[str], column: str, operation: str
) -> TableContainer:
    aggregate_operation = FieldAggregateOperation(operation)
    input_table = input.table
    output = (
        input_table[[groupby, column]]
        .groupby(groupby)
        .agg(aggregate_operation_mapping[aggregate_operation])
    )
    output.columns = [to]
    return TableContainer(table=output.reset_index())
