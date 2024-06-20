#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Merge verb implementation."""

from collections.abc import Callable
from functools import partial
from typing import Any

import pandas as pd
from pandas.api.types import is_bool

from .decorators import OutputMode, inputs, outputs, verb
from .types import MergeStrategy


@verb(
    name="merge",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def merge(
    table: pd.DataFrame,
    to: str,
    columns: list[str],
    strategy: str,
    delimiter: str = "",
    preserveSource: bool = False,  # noqa: N803
    **_kwargs: Any,
) -> pd.DataFrame:
    """Merge verb implementation."""
    merge_strategy = MergeStrategy(strategy)

    table[to] = table[columns].apply(
        partial(merge_strategies[merge_strategy], delim=delimiter), axis=1
    )

    if not preserveSource:
        table.drop(columns=columns, inplace=True)

    return table


merge_strategies: dict[MergeStrategy, Callable] = {
    MergeStrategy.FirstOneWins: lambda values, **_kwargs: values.dropna().apply(
        lambda x: _correct_type(x)
    )[0],
    MergeStrategy.LastOneWins: lambda values, **_kwargs: values.dropna().apply(
        lambda x: _correct_type(x)
    )[-1],
    MergeStrategy.Concat: lambda values, delim, **_kwargs: _create_array(values, delim),
    MergeStrategy.CreateArray: lambda values, **_kwargs: _create_array(values, ","),
}


def _correct_type(value: Any) -> str | int | Any:
    if is_bool(value):
        return str(value).lower()
    try:
        return int(value) if value.is_integer() else value
    except AttributeError:
        return value


def _create_array(column: pd.Series, delim: str) -> str:
    col: pd.DataFrame | pd.Series = column.dropna().apply(lambda x: _correct_type(x))
    return delim.join(col.astype(str))
