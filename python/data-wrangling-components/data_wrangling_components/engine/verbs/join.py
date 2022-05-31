#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import pandas as pd

from data_wrangling_components.table_store import TableContainer
from data_wrangling_components.types import JoinStrategy


__strategy_mapping = {
    JoinStrategy.Inner: "inner",
    JoinStrategy.LeftOuter: "left",
    JoinStrategy.RightOuter: "right",
    JoinStrategy.FullOuter: "outer",
    JoinStrategy.Cross: "cross",
    JoinStrategy.AntiJoin: "outer",
    JoinStrategy.SemiJoin: "outer",
}


def __clean_result(strategy: JoinStrategy, result: pd.DataFrame, source: pd.DataFrame):
    if strategy == JoinStrategy.AntiJoin:
        return result[result["_merge"] == "left_only"][source.columns]
    elif strategy == JoinStrategy.SemiJoin:
        return result[result["_merge"] == "both"][source.columns]
    else:
        return result.drop("_merge", axis=1)


def join(
    source: TableContainer,
    other: TableContainer,
    on: List[str] = None,
    strategy: str = "inner",
):
    """Inner Joins two tables together.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.types.JoinArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    join_strategy = JoinStrategy(strategy)
    input_table = source.table
    other = other.table

    if on is not None and len(on) > 1:
        left_column = on[0]
        right_column = on[1]

        output = input_table.merge(
            other,
            left_on=left_column,
            right_on=right_column,
            how=__strategy_mapping[join_strategy],
            suffixes=["_1", "_2"],
            indicator=True,
        )
    else:
        output = input_table.merge(
            other,
            on=on,
            how=__strategy_mapping[join_strategy],
            suffixes=["_1", "_2"],
            indicator=True,
        )

    return TableContainer(table=__clean_result(join_strategy, output, input_table))
