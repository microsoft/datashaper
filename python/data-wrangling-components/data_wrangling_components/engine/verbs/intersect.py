#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import pandas as pd

from data_wrangling_components.table_store import TableContainer


def intersect(source: TableContainer, others: List[TableContainer]):
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
    input_table = source.table
    others = [other.table for other in others]
    others = pd.concat(others)

    output = input_table.merge(others, how="left", indicator=True)
    output = output[output["_merge"] == "both"]
    output = output.drop("_merge", axis=1).reset_index(drop=True)

    return TableContainer(table=output)
