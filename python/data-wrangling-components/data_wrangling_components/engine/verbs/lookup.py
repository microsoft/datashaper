#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import pandas as pd

from data_wrangling_components.table_store import TableContainer


def lookup(
    source: TableContainer,
    other: TableContainer,
    columns: List[str],
    on: List[str] = None,
):
    """Executes a Lookup operation (left join and drop duplicates keep last).

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.lookup.LookupArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    input_table: pd.DataFrame = source.table
    other_table: pd.DataFrame = other.table

    if on is not None and len(on) > 1:
        left_column = on[0]
        right_column = on[1]
        other_table = other_table[[right_column] + columns]

        output = input_table.merge(
            other_table.drop_duplicates(subset=on, keep="last"),
            left_on=left_column,
            right_on=right_column,
            how="left",
        )
    else:
        if on is not None:
            other_table = other_table[on + columns]
        output = input_table.merge(
            other_table.drop_duplicates(subset=on, keep="last"),
            on=on,
            how="left",
        )

    return TableContainer(table=output)
