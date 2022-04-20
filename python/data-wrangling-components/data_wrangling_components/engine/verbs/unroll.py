#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import InputColumnListArgs, Step


@dataclass
class UnrollArgs(InputColumnListArgs):
    pass


def unroll(step: Step, store: TableStore):
    """Unroll one or more array columns into new rows.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.unroll.UnrollArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = UnrollArgs(columns=step.args["columns"])
    input_table = store.table(step.input)
    output = input_table.explode(args.columns)
    return TableContainer(id=str(step.output), name=str(step.output), table=output)
