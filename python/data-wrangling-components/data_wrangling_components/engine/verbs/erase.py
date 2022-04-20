#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Union

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import InputColumnListArgs, Step


@dataclass
class EraseArgs(InputColumnListArgs):
    value: Union[str, int, float]


def erase(step: Step, store: TableStore):
    args = EraseArgs(
        columns=step.args["columns"],
        value=step.args["value"],
    )

    input_table = store.table(step.input)

    output = input_table.copy()

    for column in args.columns:
        output[column] = output[column].apply(
            lambda df_value: None if df_value == args.value else df_value
        )

    return TableContainer(id=str(step.output), name=str(step.output), table=output)
