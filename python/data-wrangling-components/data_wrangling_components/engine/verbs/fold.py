#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List, Tuple

from data_wrangling_components.table_store import TableContainer


def fold(input: TableContainer, to: Tuple[str, str], columns: List[str]):
    input_table = input.table
    output = input_table.melt(
        id_vars=set(input_table.columns) - set(columns),
        value_vars=columns,
        var_name=to[0],
        value_name=to[1],
    ).reset_index(drop=True)

    if len(columns) > 1:
        output = output.sort_values(
            by=[col for col in input_table.columns if col not in columns]
        ).reset_index(drop=True)

    return TableContainer(table=output)
