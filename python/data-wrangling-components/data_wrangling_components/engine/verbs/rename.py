#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict

from data_wrangling_components.table_store import TableContainer


def rename(input: TableContainer, columns: Dict[str, str]):
    """Rename columns in a table.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.orderby.OrderByArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    input_table = input.table
    output = input_table.rename(columns=columns)
    return TableContainer(table=output)
