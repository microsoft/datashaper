#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import numpy as np
import pandas as pd

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import Step


@dataclass
class SpreadArgs:
    column: str
    to: List[str]


def spread(step: Step, store: TableStore):
    """Spread array elements in a column into a set of new columns.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.spread.SpreadArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = SpreadArgs(column=step.args["column"], to=step.args["to"])
    input_table = store.table(step.input)
    output = input_table.copy()
    new_columns = np.array(input_table[args.column].to_list())
    new_columns = pd.DataFrame(
        new_columns,
        columns=args.to,
    )
    output = pd.concat([output, new_columns], axis=1)
    output = output.drop(args.column, axis=1)

    return TableContainer(id=step.output, name=step.output, table=output)
