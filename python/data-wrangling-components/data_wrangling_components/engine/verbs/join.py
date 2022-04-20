#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import JoinArgs, JoinStrategy, Step


__strategy_mapping = {
    JoinStrategy.Inner: "inner",
    JoinStrategy.LeftOuter: "left",
    JoinStrategy.RightOuter: "right",
    JoinStrategy.FullOuter: "outer",
}


def join(step: Step, store: TableStore):
    """Inner Joins two tables together.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.types.JoinArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    if not isinstance(step.input, dict):
        raise Exception("Input must be dict")

    args = JoinArgs(
        on=step.args.get("on", None),
        strategy=JoinStrategy(step.args.get("strategy", "inner")),
    )
    input_table = store.table(step.input["source"])
    other = store.table(step.input["other"])

    if len(args.on) > 1:
        left_column = args.on[0]
        right_column = args.on[1] if len(args.on) > 0 else None

        output = input_table.merge(
            other,
            left_on=left_column,
            right_on=right_column,
            how=__strategy_mapping[args.strategy],
            suffixes=["_1", "_2"],
        )
    else:
        output = input_table.merge(
            other,
            on=args.on,
            how=__strategy_mapping[args.strategy],
            suffixes=["_1", "_2"],
        )

    return TableContainer(id=str(step.output), name=str(step.output), table=output)
