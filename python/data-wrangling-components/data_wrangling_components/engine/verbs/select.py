#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from data_wrangling_components.table_store import TableContainer


def select(input: TableContainer, columns: List[str]):
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
    input_table = input.table

    output = input_table.copy()
    output = input_table[columns]
    return TableContainer(table=output)
