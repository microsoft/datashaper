#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.table_store import TableContainer


def sample(input: TableContainer, size: int = None, proportion: int = None):
    """Creates a sample of data from a table.

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
    output = input_table.sample(n=size, frac=proportion)
    return TableContainer(table=output)
