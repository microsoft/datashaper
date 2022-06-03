#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import logging

from typing import List, Union

from data_wrangling_components.engine.pandas.filter_df import filter_df
from data_wrangling_components.table_store import TableContainer
from data_wrangling_components.types import (
    BooleanComparisonOperator,
    BooleanLogicalOperator,
    Criterion,
    FilterArgs,
    FilterCompareType,
    NumericComparisonOperator,
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


def filter(input: TableContainer, column: str, criteria: List, logical: str = "or"):
    filter_criteria = [
        Criterion(
            value=arg.get("value", None),
            type=FilterCompareType(arg["type"]),
            operator=_get_operator(arg["operator"]),
        )
        for arg in criteria
    ]
    logical_operator = BooleanLogicalOperator(logical)
    input_table = input.table

    filter_index = filter_df(
        input_table, FilterArgs(column, filter_criteria, logical_operator)
    )

    output = input_table[
        input_table.index.isin(filter_index[filter_index == True].index)
    ].reset_index(drop=True)

    return TableContainer(table=output)
