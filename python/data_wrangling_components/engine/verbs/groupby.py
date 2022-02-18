#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.table_store import TableStore
from data_wrangling_components.types import InputColumnListArgs, Step


class GroupByArgs(InputColumnListArgs):
    pass


def groupby(step: Step, store: TableStore):
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
    args = GroupByArgs(columns=step.args["columns"])
    input_table = store.get(step.input)
    output = input_table.groupby(by=args.columns)
    return output
