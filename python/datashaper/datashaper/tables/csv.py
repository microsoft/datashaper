#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""CSV import utilities."""

from typing import cast

import polars as pl

from .types import DataTable, parser_options_defaults, type_hints_defaults


def load_csv_table(path: str, schema: DataTable | None = None) -> pl.DataFrame:
    """Read a CSV file into a pandas DataFrame using the provided schema."""
    _schema = schema or DataTable()
    parser = _schema.parser or parser_options_defaults
    # type_hints = _schema.typeHints or type_hints_defaults
    table_df = pl.read_csv(
        path,
        separator=parser.delimiter,
        has_header=parser.header,
        columns=parser.names,
        comment_prefix=parser.comment,
        # TODO: incorporate `truncate_ragged_lines` option from polars?
        # skip_blank_lines=parser.skipBlankLines,
        # true_values=type_hints.trueValues,
        # false_values=type_hints.falseValues,
        # decimal=cast(str, type_hints.decimal or type_hints_defaults.decimal),
        # thousands=type_hints.thousands,
    )
    # pandas skiprows includes _all_ rows even the header, so we have to post-slice
    skip_rows = 0 if parser.skipRows is None else parser.skipRows
    read_rows = len(table_df) if parser.readRows is None else parser.readRows
    end_index = skip_rows + read_rows
    return cast(pl.DataFrame, table_df[skip_rows:end_index])
