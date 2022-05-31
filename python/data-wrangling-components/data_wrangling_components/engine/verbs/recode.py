#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict

from data_wrangling_components.table_store import TableContainer


class RecodeMap(dict):
    def __missing__(self, key):
        return key


def recode(input: TableContainer, to: str, column: str, map: Dict):
    """Maps values to new values in a column.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.orderby.OrderByArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    map = RecodeMap(map)

    input_table = input.table

    output = input_table.copy()
    output[to] = output[column].map(map)
    return TableContainer(table=output)
