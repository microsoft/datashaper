#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from datetime import datetime

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import InputColumnListArgs, ParseType, Step


__type_mapping = {
    ParseType.Boolean: bool,
    ParseType.Date: datetime,
    ParseType.Decimal: float,
    ParseType.Integer: int,
}


@dataclass
class ConvertArgs(InputColumnListArgs):
    type: ParseType


def convert(step: Step, store: TableStore):
    args = ConvertArgs(
        columns=step.args["columns"],
        type=ParseType(step.args["type"]),
    )

    input_table = store.table(step.input)

    output = input_table.astype(
        {column: __type_mapping[args.type] for column in args.columns}
    )

    return TableContainer(id=step.output, name=step.output, table=output)
