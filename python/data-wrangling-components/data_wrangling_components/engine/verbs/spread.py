#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import numpy as np
import pandas as pd

from data_wrangling_components.table_store import TableContainer


def spread(input: TableContainer, column: str, to: List[str]):
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
