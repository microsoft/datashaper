#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from dataclasses import dataclass

from data_wrangling_components.engine.pandas.aggregate_mapping import (
    aggregate_operation_mapping,
)
from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import (
    FieldAggregateOperation,
    OutputColumnArgs,
    Step,
)


@dataclass
class AggregateArgs(OutputColumnArgs):
    groupby: str
    column: str
    operation: FieldAggregateOperation


def aggregate(step: Step, store: TableStore) -> TableContainer:
    """Calculates the result of doing a aggregation operation on a table.

    This operation will return a single column containing the result of
    doing a groupby() and a agg() operation in pandas over the input.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.aggregate.AggregateArgs`
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution
    :type store: TableStore

    :return: new table with the result of the operation
    """
    args = AggregateArgs(
        to=step.args["to"],
        groupby=step.args["groupby"],
        column=step.args["column"],
        operation=FieldAggregateOperation(step.args["operation"]),
    )
    input_table = store.table(step.input)
    output = (
        input_table[[args.groupby, args.column]]
        .groupby(args.groupby)
        .agg(aggregate_operation_mapping[args.operation])
    )
    output.columns = [args.to]
    return TableContainer(
        id=str(step.output), name=str(step.output), table=output.reset_index()
    )
