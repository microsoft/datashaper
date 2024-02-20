#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Join verb implementation."""
from typing import cast

import pandas as pd
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


@verb(name="join", treats_input_tables_as_immutable=True)
def join(
    input: VerbInput,
    on: list[str] | None = None,
    strategy: str = "inner",
    **_kwargs: dict,
) -> VerbResult:
    """Join verb implementation."""
    join_strategy = JoinStrategy(strategy)
    input_table = cast(pd.DataFrame, input.get_input())
    other = cast(pd.DataFrame, input.get_others()[0])

    if on is not None and len(on) > 1:
        left_column = on[0]
        right_column = on[1]

        output = input_table.merge(
            other,
            left_on=left_column,
            right_on=right_column,
            how=__strategy_mapping[join_strategy],
            suffixes=cast(Suffixes, ["_1", "_2"]),
            indicator=True,
        )
    else:
        output = input_table.merge(
            other,
            on=on,
            how=__strategy_mapping[join_strategy],
            suffixes=cast(Suffixes, ["_1", "_2"]),
            indicator=True,
        )

    return create_verb_result(__clean_result(join_strategy, output, input_table))
