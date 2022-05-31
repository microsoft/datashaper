#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from data_wrangling_components.table_store import TableContainer


def groupby(input: TableContainer, columns: List[str]):
    """Creates a GroupBy table to be used with other operations.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.groupby.GroupByArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    input_table = input.table
    output = input_table.groupby(by=columns)
    return TableContainer(table=output)
