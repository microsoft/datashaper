#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from dataclasses import dataclass

from data_wrangling_components.table_store import TableStore
from data_wrangling_components.types import InputColumnListArgs, Step


@dataclass
class DedupeArgs(InputColumnListArgs):
    pass


def dedupe(step: Step, store: TableStore):
    """Removes Duplicates from a table.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.types.SetOperationArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = DedupeArgs(columns=step.args.get("columns", None))
    input_table = store.get(step.input)
    output = input_table.drop_duplicates(args.columns)
    return output
