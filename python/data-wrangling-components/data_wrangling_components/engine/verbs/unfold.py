#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import Step


@dataclass
class UnfoldArgs:
    key: str
    value: str


def unfold(step: Step, store: TableStore):
    args = UnfoldArgs(
        key=step.args["key"],
        value=step.args["value"],
    )

    input_table = store.table(step.input)

    output = input_table.copy()

    temp_index = -1
    new_index = []
    id_key = output[args.key].iloc[0]

    for key in output[args.key]:
        if key == id_key:
            temp_index += 1
        new_index.append(temp_index)

    output.index = new_index

    output = output.pivot(columns=args.key, values=args.value)

    return TableContainer(id=step.output, name=step.output, table=output)
