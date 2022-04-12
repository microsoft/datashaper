#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Union

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import InputColumnArgs, Step


@dataclass
class EraseArgs(InputColumnArgs):
    value: Union[str, int, float]


def erase(step: Step, store: TableStore):
    args = EraseArgs(
        column=step.args["column"],
        value=step.args["value"],
    )

    input_table = store.table(step.input)

    output = input_table.copy()

    output[args.column] = output[args.column].apply(
        lambda df_value: None if df_value == args.value else df_value
    )

    return TableContainer(id=step.output, name=step.output, table=output)
