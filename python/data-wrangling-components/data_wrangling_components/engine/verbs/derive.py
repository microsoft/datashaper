#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Callable, Dict

import numpy as np
import pandas as pd

from dataclasses import dataclass
from pandas.api.types import is_numeric_dtype

from data_wrangling_components.exceptions import OperationNotSupportedError
from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import MathOperator, OutputColumnArgs, Step


def __multiply(col1: pd.Series, col2: pd.Series):
    if is_numeric_dtype(col1) and is_numeric_dtype(col2):
        return np.multiply(col1, col2)
    raise OperationNotSupportedError()


__op_mapping: Dict[MathOperator, Callable] = {
    MathOperator.Add: np.add,
    MathOperator.Subtract: np.subtract,
    MathOperator.Multiply: lambda col1, col2: __multiply(col1, col2),
    MathOperator.Divide: np.divide,
    MathOperator.Concatenate: lambda col1, col2: col1.astype(str) + col2.astype(str),
}


@dataclass
class DeriveArgs(OutputColumnArgs):
    column1: str
    column2: str
    operator: MathOperator


def derive(step: Step, store: TableStore):
    """Derive a new column based on other columns.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.derive.DeriveArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = DeriveArgs(
        to=step.args["to"],
        column1=step.args["column1"],
        column2=step.args["column2"],
        operator=MathOperator(step.args["operator"]),
    )
    input_table = store.table(step.input)
    output = input_table.copy()
    try:
        output[args.to] = __op_mapping[args.operator](
            output[args.column1], output[args.column2]
        )
    except Exception:
        output[args.to] = np.nan
    return TableContainer(id=step.output, name=step.output, table=output)
