#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import pandas as pd

from ...table_store import TableContainer
from ..types import JoinStrategy
from .verb_input import VerbInput


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
        result = pd.concat(
            [
                result[result["_merge"] == "both"],
                result[result["_merge"] == "left_only"],
                result[result["_merge"] == "right_only"],
            ]
        )
        return result.drop("_merge", axis=1)


def join(
    input: VerbInput,
    on: List[str] = None,
    strategy: str = "inner",
):
    join_strategy = JoinStrategy(strategy)
    input_table = input.get_input()
    other = input.get_others()[0]

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
