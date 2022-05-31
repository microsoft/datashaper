#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from data_wrangling_components.table_store import TableContainer


def dedupe(input: TableContainer, columns: List[str] = None):
    """Removes Duplicates from a table.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.types.SetOperationArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    input_table = input.table
    output = input_table.drop_duplicates(columns)
    return TableContainer(table=output)
