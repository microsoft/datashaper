#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""CSV import utilities."""
import numpy as np
import pandas as pd

from .types import DataTable, parser_options_defaults, type_hints_defaults


def load_csv_table(path: str, schema: DataTable) -> pd.DataFrame:
    """Read a CSV file into a pandas DataFrame using the provided schema."""
    parser = schema.parser or parser_options_defaults
    type_hints = schema.typeHints or type_hints_defaults
    header = 0 if parser.header is True else None
    table_df = pd.read_csv(path,
                     sep=parser.delimiter,
                     header=header,
                     names=parser.names,
                     comment=parser.comment,
                     skip_blank_lines=parser.skipBlankLines,
                     true_values=type_hints.trueValues,
                     false_values=type_hints.falseValues,
                     decimal=type_hints.decimal,
                     thousands=type_hints.thousands,)
    # pandas skiprows includes _all_ rows even the header, so we have to post-slice
    end_index = len(table_df.index) if parser.readRows is np.inf else parser.skipRows + parser.readRows
    return table_df[parser.skipRows : end_index].reset_index(drop=True)