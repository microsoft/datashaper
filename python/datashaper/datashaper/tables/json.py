#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""JSON import utilities."""
from typing import cast

import pandas as pd

from .types import DataOrientation, DataTable, parser_options_defaults


def load_json_table(path: str, schema: DataTable | None = None) -> pd.DataFrame:
    """Read a JSON file into a pandas DataFrame using the provided schema."""
    _schema = schema or DataTable()
    parser = _schema.parser or parser_options_defaults
    orientation = _schema.shape.orientation or DataOrientation.Records
    table_df = pd.read_json(path, orient=orientation)
    # pandas skiprows includes _all_ rows even the header, so we have to post-slice
    skip_rows = 0 if parser.skipRows is None else parser.skipRows
    read_rows = len(table_df.index) if parser.readRows is None else parser.readRows
    end_index = skip_rows + read_rows
    return cast(pd.DataFrame, table_df[skip_rows:end_index].reset_index(drop=True))
