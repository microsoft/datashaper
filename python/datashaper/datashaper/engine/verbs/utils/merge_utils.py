from typing import Any, Callable, Dict

import pandas as pd
from datashaper.types import MergeStrategy
from pandas.api.types import is_bool


def _correct_type(value: Any):
    if is_bool(value):
        return str(value).lower()
    try:
        return int(value) if value.is_integer() else value
    except AttributeError:
        return value


def _create_array(column: pd.Series, delim: str) -> str:
    column = column.dropna().apply(_correct_type)
    return delim.join(column.astype(str))


def _first_one_wins(values: pd.Series, **kwargs) -> Any:
    return values.dropna().apply(_correct_type)[0]


def _last_one_wins(values: pd.Series, **kwargs) -> Any:
    return values.dropna().apply(_correct_type)[-1]


def _concat(values: pd.Series, delim: str, **kwargs) -> str:
    return _create_array(values, delim)


def _create_array_strategy(values: pd.Series, **kwargs) -> str:
    return _create_array(values, ",")


def _create_dict(values: pd.Series, **kwargs) -> dict[str, Any]:
    result: dict[str, Any] = {}
    if values.size != 2:
        raise ValueError("CreateDict merge strategy requires exactly two columns")

    keys = values[0]
    values = values[1]

    for i in range(0, len(keys)):
        key = keys[i]
        value = values[i]
        result[key] = value

    return result


strategy_mapping: Dict[MergeStrategy, Callable] = {
    MergeStrategy.FirstOneWins: _first_one_wins,
    MergeStrategy.LastOneWins: _last_one_wins,
    MergeStrategy.Concat: _concat,
    MergeStrategy.CreateArray: _create_array_strategy,
    MergeStrategy.CreateDict: _create_dict,
}