#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List, Tuple

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import Step


@dataclass
class FoldArgs:
    to: Tuple[str, str]
    columns: List[str]


def fold(step: Step, store: TableStore):
    """Creates 2 columns like a key-value in the table.

    The first column contains the previous column name.
    The second column contains the value that was in the column.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.fold.FoldArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = FoldArgs(to=step.args["to"], columns=step.args["columns"])
    input_table = store.table(step.input)
    output = (
        input_table.melt(
            id_vars=set(input_table.columns) - set(args.columns),
            value_vars=args.columns,
            var_name=args.to[0],
            value_name=args.to[1],
        )
        .reset_index(drop=True)
        .sort_values(by=list(set(input_table.columns) - set(args.columns)))
        .reset_index(drop=True)
    )
    return TableContainer(id=str(step.output), name=str(step.output), table=output)
