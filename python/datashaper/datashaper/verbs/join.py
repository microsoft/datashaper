#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Join verb implementation."""

from typing import cast

import pandas as pd
from pandas._typing import MergeHow, Suffixes
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, wrap_verb_result
from .types import JoinStrategy

__strategy_mapping: dict[JoinStrategy, MergeHow] = {
    JoinStrategy.Inner: "inner",
    JoinStrategy.LeftOuter: "left",
    JoinStrategy.RightOuter: "right",
    JoinStrategy.FullOuter: "outer",
    JoinStrategy.Cross: "cross",
    JoinStrategy.AntiJoin: "outer",
    JoinStrategy.SemiJoin: "outer",
}


def __clean_result(
    strategy: JoinStrategy, result: pd.DataFrame, source: pd.DataFrame
) -> pd.DataFrame:
    if strategy == JoinStrategy.AntiJoin:
        return cast(
            pd.DataFrame, result[result["_merge"] == "left_only"][source.columns]
        )
    if strategy == JoinStrategy.SemiJoin:
        return cast(pd.DataFrame, result[result["_merge"] == "both"][source.columns])

    result = cast(
        pd.DataFrame,
        pd.concat(
            [
                result[result["_merge"] == "both"],
                result[result["_merge"] == "left_only"],
                result[result["_merge"] == "right_only"],
            ]
        ),
    )
    return result.drop("_merge", axis=1)


@verb(
    name="join",
    immutable_input=True,
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        InputPort(name="other", required=True),
        ConfigPort(name="on"),
        ConfigPort(name="strategy"),
    ],
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def join(
    table: pd.DataFrame,
    other: pd.DataFrame,
    on: list[str] | None = None,
    strategy: str = "inner",
) -> pd.DataFrame:
    """Join verb implementation."""
    join_strategy = JoinStrategy(strategy)
    if on is not None and len(on) > 1:
        left_column = on[0]
        right_column = on[1]
        output = table.merge(
            other,
            left_on=left_column,
            right_on=right_column,
            how=__strategy_mapping[join_strategy],
            suffixes=cast(Suffixes, ["_1", "_2"]),
            indicator=True,
        )
    else:
        output = table.merge(
            other,
            on=on,
            how=__strategy_mapping[join_strategy],
            suffixes=cast(Suffixes, ["_1", "_2"]),
            indicator=True,
        )

    return __clean_result(join_strategy, output, table)
