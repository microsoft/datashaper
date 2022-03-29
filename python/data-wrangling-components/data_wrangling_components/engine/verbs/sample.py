#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Optional

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import Step


@dataclass
class SampleArgs:
    size: Optional[int] = None
    proportion: Optional[int] = None


def sample(step: Step, store: TableStore):
    """Creates a sample of data from a table.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.sample.SampleArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation.
    """
    args = SampleArgs(
        size=step.args.get("size", None), proportion=step.args.get("proportion", None)
    )
    input_table = store.table(step.input)
    output = input_table.sample(n=args.size, frac=args.proportion)
    return TableContainer(id=step.output, name=step.output, table=output)
