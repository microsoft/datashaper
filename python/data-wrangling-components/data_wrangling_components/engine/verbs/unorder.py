#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import Step


def unorder(step: Step, store: TableStore):
    """Reverts the orderby operation.

    :param step:
        Not used in this operation.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    input_table = store.table(step.input)

    output = input_table.sort_index()
    return TableContainer(id=step.output, name=step.output, table=output)
