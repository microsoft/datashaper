#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import pandas as pd

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import Step


def concat(step: Step, store: TableStore):
    """Concatenates a list of tables.

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
    output = pd.concat([input_table] + others, ignore_index=True)
    return TableContainer(id=str(step.output), name=str(step.output), table=output)
