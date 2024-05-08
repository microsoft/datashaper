#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""CSV import utilities."""
from typing import cast

import pandas as pd

from .types import DataTable, parser_options_defaults, type_hints_defaults


def load_csv_table(path: str, schema: DataTable | None = None) -> pd.DataFrame:
    """Read a CSV file into a pandas DataFrame using the provided schema."""
    _schema = schema or DataTable()
    parser = _schema.parser or parser_options_defaults
    type_hints = _schema.typeHints or type_hints_defaults
    header = 0 if parser.header is True else None
    table_df = pd.read_csv(
        path,
        sep=parser.delimiter,
        header=header,
        names=parser.names,
        comment=parser.comment,
        skip_blank_lines=parser.skipBlankLines,
        true_values=type_hints.trueValues,
        false_values=type_hints.falseValues,
        decimal=cast(str, type_hints.decimal or type_hints_defaults.decimal),
        thousands=type_hints.thousands,
    )
    # pandas skiprows includes _all_ rows even the header, so we have to post-slice
    skip_rows = 0 if parser.skipRows is None else parser.skipRows
    read_rows = len(table_df.index) if parser.readRows is None else parser.readRows
    end_index = skip_rows + read_rows
    return cast(pd.DataFrame, table_df[skip_rows:end_index].reset_index(drop=True))
