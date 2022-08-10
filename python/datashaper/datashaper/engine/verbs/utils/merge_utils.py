from typing import Any, Callable, Dict

import pandas as pd

from pandas.api.types import is_bool

from datashaper.types import MergeStrategy


__strategy_mapping: Dict[MergeStrategy, Callable] = {
    MergeStrategy.FirstOneWins: lambda values, **kwargs: values.dropna().apply(
        lambda x: correct_type(x)
    )[0],
    MergeStrategy.LastOneWins: lambda values, **kwargs: values.dropna().apply(
        lambda x: correct_type(x)
    )[-1],
    MergeStrategy.Concat: lambda values, delim, **kwargs: create_array(values, delim),
    MergeStrategy.CreateArray: lambda values, **kwargs: create_array(values, ","),
}

def correct_type(value: Any):
    if is_bool(value):
        return str(value).lower()
    try:
        return int(value) if value.is_integer() else value
    except AttributeError:
        return value

def create_array(column: pd.Series, delim: str) -> str:
    column = column.dropna().apply(lambda x: correct_type(x))
    return delim.join(column.astype(str))
