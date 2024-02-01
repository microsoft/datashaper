#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import numbers

from datetime import datetime
from typing import Callable, Dict, Optional, Union

import numpy as np
import pandas as pd

from pandas.api.types import is_bool_dtype, is_datetime64_any_dtype, is_numeric_dtype

from datashaper.engine.types import ParseType
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


def convert_int(value: str, radix: int) -> Union[int, float]:
    try:
        return int(value, radix)
    except ValueError:
        return np.nan


def to_int(column, radix):
    if radix is None:
        if column.str.startswith("0x").any() or column.str.startswith("0X").any():
            radix = 16
        elif column.str.startswith("0").any():
            radix = 8
        else:
            radix = 10
    return column.apply(lambda x: convert_int(x, radix))


def convert_float(value: str) -> float:
    try:
        return float(value)
    except ValueError:
        return np.nan


def convert_bool(value: str) -> bool:
    if (
        isinstance(value, str)
        and (value.lower() == "false" or len(value) == 0)
        or (isinstance(value, float) and np.isnan(value))
    ):
        return False
    else:
        return True


def convert_date_str(value: datetime, formatPattern: str) -> Union[str, float]:
    try:
        return datetime.strftime(value, formatPattern)
    except Exception:
        return np.nan


def to_str(column: pd.Series, formatPattern: str) -> pd.Series:
    column_datetime: pd.Series = None
    if is_datetime64_any_dtype(column):
        column_datetime = pd.to_datetime(column, errors="ignore")
        return column_datetime.apply(lambda x: convert_date_str(x, formatPattern))

    column_numeric: pd.Series = None
    if is_numeric_dtype(column):
        column_numeric = pd.to_numeric(column, errors="ignore")
    if column_numeric is not None and is_numeric_dtype(column_numeric):
        try:
            column_numeric = column_numeric.astype(pd.Int64Dtype)
            return column.apply(lambda x: "" if x is None else str(x))
        except Exception:  # nosec
            pass
    if is_bool_dtype(column):
        return column.apply(lambda x: "" if pd.isna(x) else str(x).lower())
    return column.apply(lambda x: "" if pd.isna(x) else str(x))


def to_datetime(column: pd.Series) -> pd.Series:
    if column.dropna().map(lambda x: isinstance(x, numbers.Number)).all():
        return pd.to_datetime(column, unit="ms", errors="coerce")
    else:
        return pd.to_datetime(column, errors="coerce")


__type_mapping: Dict[ParseType, Callable] = {
    ParseType.Boolean: lambda column, **kwargs: column.apply(lambda x: convert_bool(x)),
    ParseType.Date: lambda column, formatPattern, **kwargs: to_datetime(column),
    ParseType.Decimal: lambda column, **kwargs: column.apply(
        lambda x: convert_float(x)
    ),
    ParseType.Integer: lambda column, radix, **kwargs: to_int(column, radix),
    ParseType.String: lambda column, formatPattern, **kwargs: to_str(
        column, formatPattern
    ),
}


@verb(name="convert")
def convert(
    input: VerbInput,
    column: str,
    to: str,
    type: str,
    radix: Optional[int] = None,
    formatPattern: str = "%Y-%m-%d",
):
    parse_type = ParseType(type)

    input_table = input.get_input()
    output = input_table

    output[to] = __type_mapping[parse_type](
        column=output[column], radix=radix, formatPattern=formatPattern
    )

    return TableContainer(table=output)
