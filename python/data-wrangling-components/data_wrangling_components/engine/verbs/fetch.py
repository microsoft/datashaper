#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from urllib.parse import urlparse

import pandas as pd

from data_wrangling_components.table_store import TableContainer


__reader_mapping = {
    "csv": lambda **kwargs: pd.read_csv(
        kwargs["url"], sep=kwargs["delimiter"], na_values=["undefined"]
    ),
    "json": lambda **kwargs: pd.read_json(kwargs["url"]),
}


def fetch(url: str, delimiter: str = ",", **kwargs):
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
    file_type = urlparse(url).path.split(".")[-1]
    output = __reader_mapping[file_type](**{"url": url, "delimiter": delimiter})
    return TableContainer(table=output)
