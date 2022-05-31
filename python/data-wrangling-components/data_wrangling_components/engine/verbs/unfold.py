#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from collections import defaultdict
from typing import Dict

import pandas as pd

from data_wrangling_components.table_store import TableContainer


def unfold(input: TableContainer, key: str, value: str):

    input_table = input.table

    output = input_table.copy()

    new_index = []
    id_key: Dict[str, int] = defaultdict(int)

    for temp_key in output[key]:
        new_index.append(id_key[temp_key])
        id_key[temp_key] += 1

    output.index = new_index

    output_temp = output.pivot(columns=key, values=value)
    other_columns = [column for column in output.columns if column not in [key, value]]
    output = pd.concat(
        [output[other_columns].groupby(level=0).agg("first"), output_temp], axis=1
    )

    return TableContainer(table=output)
