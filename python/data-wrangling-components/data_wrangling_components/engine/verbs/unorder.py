#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.table_store import TableContainer


def unorder(input: TableContainer):
    """Reverts the orderby operation.

    :param step:
        Not used in this operation.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    input_table = input.table

    output = input_table.sort_index()
    return TableContainer(table=output)
