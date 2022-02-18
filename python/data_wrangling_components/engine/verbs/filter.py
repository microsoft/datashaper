#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.pandas.filter_df import filter_df
from data_wrangling_components.table_store import TableStore
from data_wrangling_components.types import (
    FilterArgs,
    FilterCompareType,
    NumericComparisonOperator,
    Step,
    StringComparisonOperator,
)


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
    try:
        args = FilterArgs(
            to=step.args.get("to", ""),
            column=step.args["column"],
            type=FilterCompareType(step.args["type"]),
            operator=NumericComparisonOperator(
                step.args["operator"],
            ),
            value=step.args.get("value", None),
        )
    except Exception:
        args = FilterArgs(
            to=step.args.get("to", ""),
            column=step.args["column"],
            type=FilterCompareType(step.args["type"]),
            operator=StringComparisonOperator(
                step.args["operator"],
            ),
            value=step.args.get("value", None),
        )
    input_table = store.get(step.input)

    output = filter_df(input_table, args).reset_index(drop=True)

    return output
