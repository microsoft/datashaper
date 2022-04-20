#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import pandas as pd

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import Step


def difference(step: Step, store: TableStore):
    """Calculates the set difference between two tables.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.types.SetOperationArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    if not isinstance(step.input, dict):
        raise Exception("Input must be dict")

    input_table = store.table(step.input["source"])
    others = [store.table(other) for other in step.input["others"]]
    others = pd.concat(others)

    output = input_table.merge(others, how="left", indicator=True)
    output = output[output["_merge"] == "left_only"]
    output = output.drop("_merge", axis=1)

    return TableContainer(id=str(step.output), name=str(step.output), table=output)
