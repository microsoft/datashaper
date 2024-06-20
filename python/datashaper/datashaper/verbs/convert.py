#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Convert verb implementation."""

import numbers
from collections.abc import Callable
from datetime import datetime
from typing import Any, cast

import numpy as np
import pandas as pd
from pandas.api.types import is_bool_dtype, is_datetime64_any_dtype, is_numeric_dtype

from .decorators import OutputMode, inputs, outputs, verb
from .types import ParseType


def _convert_int(value: str, radix: int) -> int | float:
    try:
        return int(value, radix)
    except ValueError:
        return np.nan


def _to_int(column: pd.Series, radix: int) -> pd.DataFrame | pd.Series:
    if radix is None:
        if column.str.startswith("0x").any() or column.str.startswith("0X").any():
            radix = 16
        elif column.str.startswith("0").any():
            radix = 8
        else:
            radix = 10
    return column.apply(lambda x: _convert_int(x, radix))


def _convert_float(value: str) -> float:
    try:
        return float(value)
    except ValueError:
        return np.nan


# todo: our schema TypeHints allows strict definition of what should be allowed for a bool, so we should provide a way to inject these beyond the defaults
# see https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#boolean-values
def _convert_bool(value: str) -> bool:
    return isinstance(value, str) and (value.lower() == "true")


def _convert_date_to_str(value: datetime, format_pattern: str) -> str | float:
    try:
        return datetime.strftime(value, format_pattern)
    except Exception:
        return np.nan


def _to_str(column: pd.Series, format_pattern: str) -> pd.DataFrame | pd.Series:
    column_numeric: pd.Series | None = None
    if is_numeric_dtype(column):
        column_numeric = cast(pd.Series, pd.to_numeric(column))
    if column_numeric is not None and is_numeric_dtype(column_numeric):
        try:
            return column.apply(lambda x: "" if x is None else str(x))
        except Exception:  # noqa: S110
            pass

    try:
        datetime_column = pd.to_datetime(column)
    except Exception:
        datetime_column = column
    if is_datetime64_any_dtype(datetime_column):
        return datetime_column.apply(lambda x: _convert_date_to_str(x, format_pattern))
    if isinstance(column.dtype, pd.ArrowDtype) and "timestamp" in column.dtype.name:
        return column.apply(lambda x: _convert_date_to_str(x, format_pattern))

    if is_bool_dtype(column):
        return column.apply(lambda x: "" if pd.isna(x) else str(x).lower())
    return column.apply(lambda x: "" if pd.isna(x) else str(x))


def _to_datetime(column: pd.Series) -> pd.Series:
    if column.dropna().map(lambda x: isinstance(x, numbers.Number)).all():
        return pd.to_datetime(column, unit="ms")
    return pd.to_datetime(column)


def _to_array(column: pd.Series, delimiter: str) -> pd.Series | pd.DataFrame:
    def convert_value(value: Any) -> list:
        if pd.isna(value):
            return []
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            return value.split(delimiter)
        return [value]

    return column.apply(convert_value)


__type_mapping: dict[ParseType, Callable] = {
    ParseType.Boolean: lambda column, **_kwargs: column.apply(
        lambda x: _convert_bool(x)
    ),
    ParseType.Date: lambda column, **_kwargs: _to_datetime(column),
    ParseType.Decimal: lambda column, **_kwargs: column.apply(
        lambda x: _convert_float(x)
    ),
    ParseType.Integer: lambda column, radix, **_kwargs: _to_int(column, radix),
    ParseType.String: lambda column, format_pattern, **_kwargs: _to_str(
        column, format_pattern
    ),
    ParseType.Array: lambda column, delimiter, **_kwargs: _to_array(column, delimiter),
}


@verb(
    name="convert",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def convert(
    table: pd.DataFrame,
    column: str,
    to: str,
    type: str,  # noqa: A002
    radix: int | None = None,
    delimiter: str | None = ",",
    formatPattern: str = "%Y-%m-%d",  # noqa: N803
    **_kwargs: Any,
) -> pd.DataFrame:
    """Convert verb implementation."""
    parse_type = ParseType(type)
    table[to] = __type_mapping[parse_type](
        column=table[column],
        radix=radix,
        format_pattern=formatPattern,
        delimiter=delimiter,
    )
    return table
