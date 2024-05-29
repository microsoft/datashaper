#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""JSON import utilities."""

from typing import cast

import polars as pl

from .types import DataTable, parser_options_defaults


def load_json_table(path: str, schema: DataTable | None = None) -> pl.DataFrame:
    """Read a JSON file into a pandas DataFrame using the provided schema."""
    _schema = schema or DataTable()
    parser = _schema.parser or parser_options_defaults
    table_df = pl.read_json(path)
    # pandas skiprows includes _all_ rows even the header, so we have to post-slice
    skip_rows = 0 if parser.skipRows is None else parser.skipRows
    read_rows = len(table_df) if parser.readRows is None else parser.readRows
    end_index = skip_rows + read_rows
    return cast(pl.DataFrame, table_df[skip_rows:end_index])
