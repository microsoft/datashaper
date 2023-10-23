#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Callable, Dict

import numpy as np
import pandas as pd
from pandas.api.types import is_numeric_dtype

from ...table_store import TableContainer
from ..types import MathOperator
from .verb_input import VerbInput


def __multiply(col1: pd.Series, col2: pd.Series):
    if is_numeric_dtype(col1) and is_numeric_dtype(col2):
        return np.multiply(col1, col2)
    raise Exception("Operation not supported")


def __concatenate(col1: pd.Series, col2: pd.Series):
    return col1.astype(str) + col2.astype(str)


__op_mapping: Dict[MathOperator, Callable] = {
    MathOperator.Add: lambda col1, col2: np.add(col1, col2)
    if is_numeric_dtype(col1) and is_numeric_dtype(col2)
    else __concatenate(col1, col2),
    MathOperator.Subtract: np.subtract,
    MathOperator.Multiply: lambda col1, col2: __multiply(col1, col2),
    MathOperator.Divide: np.divide,
    MathOperator.Concatenate: __concatenate,
}


def derive(input: VerbInput, to: str, column1: str, column2: str, operator: str):
    math_operator = MathOperator(operator)

    input_table = input.get_input()
    output = input_table.copy()
    try:
        output[to] = __op_mapping[math_operator](output[column1], output[column2])
    except Exception:
        output[to] = np.nan
    return TableContainer(table=output)
