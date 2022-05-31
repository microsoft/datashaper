#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from data_wrangling_components.engine.pandas.filter_df import filter_df
from data_wrangling_components.engine.verbs.filter import _get_operator
from data_wrangling_components.table_store import TableContainer
from data_wrangling_components.types import (
    BooleanLogicalOperator,
    Criterion,
    FilterArgs,
    FilterCompareType,
)


def binarize(
    input: TableContainer, to: str, column: str, criteria: List, logical: str = "or"
):
    """Creates a column with a 1 or 0 depending on if a value meets a criteria

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.binarize.BinarizeArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    filter_criteria = [
        Criterion(
            value=arg.get("value", None),
            type=FilterCompareType(arg["type"]),
            operator=_get_operator(arg["operator"]),
        )
        for arg in criteria
    ]
    logical_operator = BooleanLogicalOperator(logical)

    input_table = input.table

    filter_result = filter_df(
        input_table, FilterArgs(column, filter_criteria, logical_operator)
    )
    output = input_table.copy()
    output[to] = filter_result.map({True: 1, False: 0}, na_action="ignore")

    return TableContainer(table=output)
