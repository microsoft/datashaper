#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import Step


@dataclass
class SelectArgs:
    columns: List[str]


def select(step: Step, store: TableStore):
    """Selects columns of a table.

    Returns a new table only with the specified columns.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.sample.SampleArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = SelectArgs(columns=step.args["columns"])

    input_table = store.table(step.input)

    output = input_table.copy()
    output = input_table[[column for column in args.columns]]
    return TableContainer(id=str(step.output), name=str(step.output), table=output)
