#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List, Tuple

from data_wrangling_components.table_store import TableContainer


def fold(input: TableContainer, to: Tuple[str, str], columns: List[str]):
    """Creates 2 columns like a key-value in the table.

    The first column contains the previous column name.
    The second column contains the value that was in the column.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.fold.FoldArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
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
