#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from dataclasses import dataclass

from data_wrangling_components.engine.pandas.filter_df import filter_df
from data_wrangling_components.engine.verbs.filter import _get_operator
from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import (
    Criterion,
    FilterArgs,
    FilterCompareType,
    OutputColumnArgs,
    Step,
)


@dataclass
class BinarizeArgs(FilterArgs, OutputColumnArgs):
    pass


def binarize(step: Step, store: TableStore):
    """Creates a column with a 1 or 0 depending on if a value meets a criteria

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.binarize.BinarizeArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = BinarizeArgs(
        to=step.args["to"],
        column=step.args["column"],
        criteria=[
            Criterion(
                value=step.args.get("value", None),
                type=FilterCompareType(arg["type"]),
                operator=_get_operator(arg["operator"]),
            )
            for arg in step.args["criteria"]
        ],
    )

    input_table = store.table(step.input)

    filter_result = filter_df(input_table, args)
    output = input_table.copy()
    output[args.to] = input_table.index.isin(filter_result.index)
    output[args.to] = output[args.to].astype(int)

    return TableContainer(id=step.output, name=step.output, table=output)
