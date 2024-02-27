"""Contains the merge strategy functions for the merge verb."""
from collections.abc import Callable
from typing import Any

import pandas as pd
from pandas.api.types import is_bool

from datashaper.engine.types import MergeStrategy

strategy_mapping: dict[MergeStrategy, Callable] = {
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
