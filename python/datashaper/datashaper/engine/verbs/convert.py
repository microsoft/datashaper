#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Convert verb implementation."""
import numbers
from collections.abc import Callable
from datetime import datetime
from typing import cast

import numpy as np
import pandas as pd
from pandas.api.types import is_bool_dtype, is_datetime64_any_dtype, is_numeric_dtype

from datashaper.engine.types import ParseType
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


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


def _convert_bool(value: str) -> bool:
    return not (
        isinstance(value, str)
        and (value.lower() == "false" or len(value) == 0)
        or (isinstance(value, float) and np.isnan(value))
    )


def _convert_date_str(value: datetime, format_pattern: str) -> str | float:
    try:
        return datetime.strftime(value, format_pattern)
    except Exception:
        return np.nan


def _to_str(column: pd.Series, format_pattern: str) -> pd.DataFrame | pd.Series:
    if is_datetime64_any_dtype(column) or (
        isinstance(column.dtype, pd.ArrowDtype) and "timestamp" in column.dtype.name
    ):
        return column.apply(lambda x: _convert_date_str(x, format_pattern))

    column_numeric: pd.Series | None = None
    if is_numeric_dtype(column):
        column_numeric = cast(pd.Series, pd.to_numeric(column, errors="ignore"))
    if column_numeric is not None and is_numeric_dtype(column_numeric):
        try:
            column_numeric = column_numeric.astype(pd.Int64Dtype)
            return column.apply(lambda x: "" if x is None else str(x))
        except Exception:  # noqa: S110
            pass
    if is_bool_dtype(column):
        return column.apply(lambda x: "" if pd.isna(x) else str(x).lower())
    return column.apply(lambda x: "" if pd.isna(x) else str(x))


def _to_datetime(column: pd.Series) -> pd.Series:
    if column.dropna().map(lambda x: isinstance(x, numbers.Number)).all():
        return pd.to_datetime(column, unit="ms", errors="coerce")
    return pd.to_datetime(column, errors="coerce")


__type_mapping: dict[ParseType, Callable] = {
    ParseType.Boolean: lambda column, **_kwargs: column.apply(
        lambda x: _convert_bool(x)
    ),
    ParseType.Date: lambda column, format_pattern, **_kwargs: _to_datetime(column),  # noqa: ARG005
    ParseType.Decimal: lambda column, **_kwargs: column.apply(
        lambda x: _convert_float(x)
    ),
    ParseType.Integer: lambda column, radix, **_kwargs: _to_int(column, radix),
    ParseType.String: lambda column, format_pattern, **_kwargs: _to_str(
        column, format_pattern
    ),
}


@verb(name="convert")
def convert(
    input: VerbInput,
    column: str,
    to: str,
    type: str,  # noqa: A002
    radix: int | None = None,
    formatPattern: str = "%Y-%m-%d",  # noqa: N803
) -> TableContainer:
    """Convert verb implementation."""
    parse_type = ParseType(type)
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)

    output[to] = __type_mapping[parse_type](
        column=output[column], radix=radix, format_pattern=formatPattern
    )

    return TableContainer(table=output)
