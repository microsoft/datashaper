#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Join verb implementation."""

from typing import cast

import pandas as pd
import polars as pl
from pandas._typing import MergeHow, Suffixes

from datashaper.engine.types import JoinStrategy
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result

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
    strategy: JoinStrategy, result: pl.DataFrame, source: pl.DataFrame
) -> pl.DataFrame:
    if strategy == JoinStrategy.AntiJoin:
        return cast(
            pl.DataFrame, result[result["_merge"] == "left_only"][source.columns]
        )
    if strategy == JoinStrategy.SemiJoin:
        return cast(pl.DataFrame, result[result["_merge"] == "both"][source.columns])

    result = cast(
        pl.DataFrame,
        pl.concat(
            [
                result[result["_merge"] == "both"],
                result[result["_merge"] == "left_only"],
                result[result["_merge"] == "right_only"],
            ]
        ),
    )
    return result.drop("_merge")


@verb(name="join", treats_input_tables_as_immutable=True)
def join(
    input: VerbInput,
    on: list[str] | None = None,
    strategy: str = "inner",
    **_kwargs: dict,
) -> VerbResult:
    """Join verb implementation."""
    join_strategy = JoinStrategy(strategy)
    input_table = cast(pl.DataFrame, input.get_input())
    other = cast(pl.DataFrame, input.get_others()[0])

    if on is not None and len(on) > 1:
        left_column = on[0]
        right_column = on[1]

        output = input_table.join(
            other,
            left_on=left_column,
            right_on=right_column,
            how=__strategy_mapping[join_strategy],
            suffixes=cast(Suffixes, ["_1", "_2"]),
            indicator=True,
        )
    else:
        output = input_table.join(
            other,
            on=on,
            how=__strategy_mapping[join_strategy],
            suffixes=cast(Suffixes, ["_1", "_2"]),
            indicator=True,
        )

    return create_verb_result(__clean_result(join_strategy, output, input_table))
