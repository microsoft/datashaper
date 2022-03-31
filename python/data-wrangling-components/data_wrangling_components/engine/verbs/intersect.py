#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import pandas as pd

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import SetOperationArgs, Step


def intersect(step: Step, store: TableStore):
    """Calculates the set intersection between two tables.

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
    input_table = store.table(step.input)
    others = [store.table(other) for other in args.others]
    others = pd.concat(others)

    output = input_table.merge(others, how="left", indicator=True)
    output = output[output["_merge"] == "both"]
    output = output.drop("_merge", axis=1).reset_index(drop=True)

    return TableContainer(id=step.output, name=step.output, table=output)
