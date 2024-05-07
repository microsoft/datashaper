#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""JSON import utilities."""
import numpy as np
import pandas as pd

from .types import DataTable, parser_options_defaults


def load_json_table(path: str, schema: DataTable | None = None) -> pd.DataFrame:
    """Read a JSON file into a pandas DataFrame using the provided schema."""
    _schema = schema or DataTable()
    parser = _schema.parser or parser_options_defaults
    table_df = pd.read_json(path, orient=_schema.shape.orientation)
    # pandas skiprows includes _all_ rows even the header, so we have to post-slice
    end_index = len(table_df.index) if parser.readRows is np.inf else parser.skipRows + parser.readRows
    return table_df[parser.skipRows : end_index].reset_index(drop=True)