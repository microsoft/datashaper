#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import InputColumnListArgs, JoinArgs, Step


@dataclass
class LookupArgs(InputColumnListArgs, JoinArgs):
    pass


def lookup(step: Step, store: TableStore):
    """Executes a Lookup operation (left join and drop duplicates keep last).

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.lookup.LookupArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = LookupArgs(
        other=step.args["other"],
        on=step.args.get("on", None),
        columns=step.args["columns"],
    )
    input_table = store.table(step.input)
    other = store.table(args.other)

    if len(args.on) > 1:
        left_column = args.on[0]
        right_column = args.on[1]
        other = other[[right_column] + args.columns]

        output = input_table.merge(
            other.drop_duplicates(subset=args.on, keep="last"),
            left_on=left_column,
            right_on=right_column,
            how="left",
        )
    else:
        other = other[args.on + args.columns]
        output = input_table.merge(
            other.drop_duplicates(subset=args.on, keep="last"),
            on=args.on,
            how="left",
        )

    return TableContainer(id=step.output, name=step.output, table=output)
