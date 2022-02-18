#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import pandas as pd

from data_wrangling_components.table_store import TableStore
from data_wrangling_components.types import SetOperationArgs, Step


def union(step: Step, store: TableStore):
    """Calculates the set union between two tables.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.types.SetOperationArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = SetOperationArgs(others=step.args["others"])
    input_table = store.get(step.input)
    others = [store.get(other) for other in args.others]
    output = pd.concat([input_table] + others, ignore_index=True).drop_duplicates()

    return output
