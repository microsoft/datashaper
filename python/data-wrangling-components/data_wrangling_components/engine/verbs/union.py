#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import pandas as pd

from data_wrangling_components.table_store import TableContainer


def union(source: TableContainer, others: List[TableContainer]):
    input_table = source.table
    others = [other.table for other in others]
    output = pd.concat([input_table] + others, ignore_index=True).drop_duplicates()

    return TableContainer(table=output)
