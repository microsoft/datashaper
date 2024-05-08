#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""JSON import utilities."""
import pandas as pd

from .csv import load_csv_table
from .json import load_json_table
from .types import DataTable


def load_table(path: str, schema: DataTable | None = None) -> pd.DataFrame:
    """Read a DataTable file into a pandas DataFrame using the provided schema."""
    _schema = schema or DataTable()
    loader = load_csv_table if _schema.format == "csv" else load_json_table
    return loader(path, _schema)
