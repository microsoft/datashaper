#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging

from typing import Union

import pandas as pd

from data_wrangling_components.engine.pandas.filter_df import filter_df
from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import (
    BooleanComparisonOperator,
    BooleanLogicalOperator,
    Criterion,
    FilterArgs,
    FilterCompareType,
    NumericComparisonOperator,
    Step,
    StringComparisonOperator,
)


def _get_operator(
    operator: str,
) -> Union[
    StringComparisonOperator, NumericComparisonOperator, BooleanComparisonOperator
]:
    try:
        return StringComparisonOperator(operator)
    except Exception:
        logging.info(f"[{operator}] is not a string comparison operator")
    try:
        return NumericComparisonOperator(operator)
    except Exception:
        logging.info(f"[{operator}] is not a numeric comparison operator")
    try:
        return BooleanComparisonOperator(operator)
    except Exception:
        logging.info(f"[{operator}] is not a boolean comparison operator")
    raise Exception(f"[{operator}] is not a recognized comparison operator")


def filter(step: Step, store: TableStore):
    """Filters a table based on a condition.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.types.FilterArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = FilterArgs(
        column=step.args["column"],
        criteria=[
            Criterion(
                value=arg.get("value", None),
                type=FilterCompareType(arg["type"]),
                operator=_get_operator(arg["operator"]),
            )
            for arg in step.args["criteria"]
        ],
        logical=BooleanLogicalOperator(step.args.get("logical", "or")),
    )
    input_table = store.table(step.input)

    filter_index = filter_df(input_table, args)

    output = input_table[
        input_table.index.isin(filter_index[filter_index == True].index)
    ].reset_index(drop=True)

    return TableContainer(id=str(step.output), name=str(step.output), table=output)
