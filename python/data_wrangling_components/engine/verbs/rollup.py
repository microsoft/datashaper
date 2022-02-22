#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Iterable

import pandas as pd

from dataclasses import dataclass

from data_wrangling_components.table_store import TableStore
from data_wrangling_components.types import (
    FieldAggregateOperation,
    InputColumnArgs,
    OutputColumnArgs,
    Step,
)


@dataclass
class RollupArgs(InputColumnArgs, OutputColumnArgs):
    operation: FieldAggregateOperation


def rollup(step: Step, store: TableStore):
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
    args = RollupArgs(
        column=step.args["column"],
        to=step.args["to"],
        operation=FieldAggregateOperation(step.args["operation"]),
    )
    input_table = store.get(step.input)

    agg_result = input_table.agg(args.operation.value)[args.column]

    if not isinstance(agg_result, Iterable):
        agg_result = [agg_result]
    if isinstance(agg_result, pd.Series):
        agg_result = agg_result.reset_index(drop=True)

    output = pd.DataFrame({args.to: agg_result})

    return output
