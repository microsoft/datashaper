#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from dataclasses import dataclass

from data_wrangling_components.engine.pandas.filter_df import _boolean_function_map
from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import (
    BooleanLogicalOperator,
    InputColumnListArgs,
    OutputColumnArgs,
    Step,
)


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
