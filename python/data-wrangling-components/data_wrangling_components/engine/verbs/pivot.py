#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from dataclasses import dataclass

from data_wrangling_components.engine.pandas.aggregate_mapping import (
    aggregate_operation_mapping,
)
from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import FieldAggregateOperation, Step


@dataclass
class PivotArgs:
    key: str
    value: str
    operation: FieldAggregateOperation


def pivot(step: Step, store: TableStore):
    args = PivotArgs(
        key=step.args["key"],
        value=step.args["value"],
        operation=FieldAggregateOperation(step.args["operation"]),
    )

    input_table = store.table(step.input)

    output = input_table.pivot_table(
        values=args.value,
        columns=args.key,
        aggfunc=aggregate_operation_mapping[args.operation],
    )

    return TableContainer(id=str(step.output), name=str(step.output), table=output)
