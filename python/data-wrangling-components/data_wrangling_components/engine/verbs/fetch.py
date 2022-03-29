#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Optional

import pandas as pd

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import Step


@dataclass
class FetchArgs:
    url: str
    delimiter: Optional[str] = ","


def fetch(step: Step, store: TableStore):
    """Fetch a table from a URL.

    :param step:
        Parameters to execute the operation.
        See :py:class:`~data_wrangling_components.engine.verbs.fetch.FetchArgs`.
    :type step: Step
    :param store:
        Table store that contains the inputs to be used in the execution.
    :type store: TableStore

    :return: new table with the result of the operation
    """
    args = FetchArgs(url=step.args["url"], delimiter=step.args.get("delimiter", ","))
    output = pd.read_csv(args.url, sep=args.delimiter)
    return TableContainer(id=step.output, name=step.output, table=output)
