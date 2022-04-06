#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import (
    BooleanLogicalOperator,
    InputColumnListArgs,
    OutputColumnArgs,
    Step,
)


_boolean_function_map = {
    BooleanLogicalOperator.OR: lambda df: df.any(axis="columns"),
    BooleanLogicalOperator.AND: lambda df: df.all(axis="columns"),
    BooleanLogicalOperator.NOR: lambda df: ~df.any(axis="columns"),
    BooleanLogicalOperator.NAND: lambda df: ~df.all(axis="columns"),
    BooleanLogicalOperator.XOR: lambda df: df.sum(axis="columns").apply(
        lambda x: x == 1
    ),
}


@dataclass
class BooleanArgs(InputColumnListArgs, OutputColumnArgs):
    operator: BooleanLogicalOperator


def boolean(step: Step, store: TableStore):
    args = BooleanArgs(
        to=step.args["to"],
        columns=step.args["columns"],
        operator=BooleanLogicalOperator(step.args["operator"]),
    )

    input_table = store.table(step.input)

    output = input_table.copy()

    output[args.to] = _boolean_function_map[args.operator](output)

    return TableContainer(id=step.output, name=step.output, table=output)
