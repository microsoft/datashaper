#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Iterable

import pandas as pd

from data_wrangling_components.engine.pandas.aggregate_mapping import (
    aggregate_operation_mapping,
)
from data_wrangling_components.table_store import TableContainer
from data_wrangling_components.types import FieldAggregateOperation


def rollup(input: TableContainer, column: str, to: str, operation: str):
    """Rollup a table to produce an aggregation summary.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.rollup.RollupArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    aggregate_operation = FieldAggregateOperation(operation)
    input_table = input.table

    agg_result = input_table.agg(aggregate_operation_mapping[aggregate_operation])[
        column
    ]

    if not isinstance(agg_result, Iterable):
        agg_result = [agg_result]
    if isinstance(agg_result, pd.Series):
        agg_result = agg_result.reset_index(drop=True)

    output = pd.DataFrame({to: agg_result})

    return TableContainer(table=output)
