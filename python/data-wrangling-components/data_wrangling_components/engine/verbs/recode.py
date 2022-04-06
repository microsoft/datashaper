#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import InputColumnArgs, OutputColumnArgs, Step


class RecodeMap(dict):
    def __missing__(self, key):
        return key


@dataclass
class RecodeArgs(InputColumnArgs, OutputColumnArgs):
    map: RecodeMap


def recode(step: Step, store: TableStore):
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
    args = RecodeArgs(
        to=step.args["to"], column=step.args["column"], map=RecodeMap(step.args["map"])
    )
    input_table = store.table(step.input)

    output = input_table.copy()
    output[args.to] = output[args.column].map(args.map)
    return TableContainer(id=step.output, name=step.output, table=output)
