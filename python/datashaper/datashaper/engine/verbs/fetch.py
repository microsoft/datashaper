#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from urllib.parse import urlparse

import pandas as pd

from datashaper.table_store import TableContainer


__reader_mapping = {
    "csv": lambda **kwargs: pd.read_csv(
        kwargs["url"], sep=kwargs["delimiter"], na_values=["undefined"]
    ),
    "json": lambda **kwargs: pd.read_json(kwargs["url"]),
}


def fetch(url: str, delimiter: str = ",", **kwargs):
    file_type = urlparse(url).path.split(".")[-1]
    output = __reader_mapping[file_type](**{"url": url, "delimiter": delimiter})
    return TableContainer(table=output)
