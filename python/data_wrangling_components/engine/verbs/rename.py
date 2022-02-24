#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict

from dataclasses import dataclass

from data_wrangling_components.table_store import TableStore
from data_wrangling_components.types import Step


@dataclass
class RenameArgs:
    columns: Dict[str, str]


def rename(step: Step, store: TableStore):
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
    args = RenameArgs(columns=step.args["columns"])
    input_table = store.get(step.input)
    return input_table.rename(columns=args.columns)
