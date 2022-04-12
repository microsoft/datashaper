#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Optional

import pandas as pd

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import InputColumnArgs, Step


@dataclass
class OneHotArgs(InputColumnArgs):
    prefix: Optional[str] = ""


def onehot(step: Step, store: TableStore):
    args = OneHotArgs(
        column=step.args["column"],
        prefix=step.args.get("prefix", ""),
    )

    input_table = store.table(step.input)

    dummies = pd.get_dummies(
        input_table[args.column], prefix=args.prefix, prefix_sep=""
    )

    output = pd.concat([input_table, dummies], axis=1)

    return TableContainer(id=step.output, name=step.output, table=output)
