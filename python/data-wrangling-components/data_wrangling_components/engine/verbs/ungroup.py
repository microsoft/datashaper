#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import Step


def ungroup(step: Step, store: TableStore):
    """Ungroups a table.

    In pandas it converts a DataFrameGroupBy into a DataFrame object.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.spread.SpreadArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    input_table = store.table(step.input)
    output = input_table.obj
    return TableContainer(id=step.output, name=step.output, table=output)
