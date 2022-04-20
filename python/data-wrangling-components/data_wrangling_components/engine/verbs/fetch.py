#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Optional
from urllib.parse import urlparse

import pandas as pd

from dataclasses import dataclass

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import Step


@dataclass
class FetchArgs:
    url: str
    delimiter: Optional[str] = ","


__reader_mapping = {
    "csv": lambda args: pd.read_csv(
        args.url, sep=args.delimiter, na_values=["undefined"]
    ),
    "json": lambda args: pd.read_json(args.url),
}


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
    file_type = urlparse(args.url).path.split(".")[-1]
    output = __reader_mapping[file_type](args)
    return TableContainer(id=str(step.output), name=str(step.output), table=output)
