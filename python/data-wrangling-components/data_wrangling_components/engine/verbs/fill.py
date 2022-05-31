#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Union

from data_wrangling_components.table_store import TableContainer


def fill(
    input: TableContainer,
    to: str,
    value: Union[str, int, float, bool],
):
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
    input_table = input.table
    output = input_table.copy()
    output[to] = value
    return TableContainer(table=output)
