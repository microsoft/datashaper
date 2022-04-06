#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import FillArgs, Step


def fill(step: Step, store: TableStore):
    """Fills a column with a value.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.types.FillArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = FillArgs(to=step.args["to"], value=step.args["value"])
    input_table = store.table(step.input)
    output = input_table.copy()
    output[args.to] = args.value
    return TableContainer(id=step.output, name=step.output, table=output)
