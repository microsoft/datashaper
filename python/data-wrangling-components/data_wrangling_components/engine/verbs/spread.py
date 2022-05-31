#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import numpy as np
import pandas as pd

from data_wrangling_components.table_store import TableContainer


def spread(input: TableContainer, column: str, to: List[str]):
    """Spread array elements in a column into a set of new columns.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.spread.SpreadArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    input_table = input.table
    output = input_table.copy()
    new_columns = np.array(input_table[column].to_list())
    new_columns = pd.DataFrame(
        new_columns,
        columns=to,
    )
    output = pd.concat([output, new_columns], axis=1)
    output = output.drop(column, axis=1)

    return TableContainer(table=output)
