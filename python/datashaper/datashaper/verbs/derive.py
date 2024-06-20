#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Derive verb implementation."""

from collections.abc import Callable
from typing import Any

import numpy as np
import pandas as pd
from pandas.api.types import is_numeric_dtype

from datashaper.errors import VerbOperationNotSupportedError

from .decorators import OutputMode, inputs, outputs, verb
from .types import MathOperator


def __multiply(col1: pd.Series, col2: pd.Series) -> np.ndarray:
    if is_numeric_dtype(col1) and is_numeric_dtype(col2):
        return np.multiply(col1, col2)
    raise VerbOperationNotSupportedError


def __concatenate(col1: pd.Series, col2: pd.Series) -> pd.Series:
    return col1.astype(str) + col2.astype(str)


__op_mapping: dict[MathOperator, Callable] = {
    MathOperator.Add: lambda col1, col2: np.add(col1, col2)
    if is_numeric_dtype(col1) and is_numeric_dtype(col2)
    else __concatenate(col1, col2),
    MathOperator.Subtract: np.subtract,
    MathOperator.Multiply: lambda col1, col2: __multiply(col1, col2),
    MathOperator.Divide: np.divide,
    MathOperator.Concatenate: __concatenate,
}


@verb(
    name="derive",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def derive(
    table: pd.DataFrame,
    to: str,
    column1: str,
    column2: str,
    operator: str,
    **_kwargs: Any,
) -> pd.DataFrame:
    """Derive verb implementation."""
    math_operator = MathOperator(operator)
    try:
        table[to] = __op_mapping[math_operator](table[column1], table[column2])
    except Exception:
        table[to] = np.nan
    return table
