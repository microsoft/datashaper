#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import OrderByInstruction, SortDirection, Step


@dataclass
class OrderByArgs:
    orders: List[OrderByInstruction]


def orderby(step: Step, store: TableStore):
    """Order the values in a set of columns.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.orderby.OrderByArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = OrderByArgs(
        orders=[OrderByInstruction(**order) for order in step.args["orders"]]
    )
    input_table = store.table(step.input)

    columns = [order.column for order in args.orders]
    ascending = [order.direction == SortDirection.Ascending for order in args.orders]

    output = input_table.sort_values(by=columns, ascending=ascending)
    return TableContainer(id=step.output, name=step.output, table=output)
