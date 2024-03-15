"""Utility functions for type checking and conversion."""

import pandas as pd

_COLUMN_NOT_ARRAY_ERROR = "Column is not a string or array type"


def is_array_column(column: pd.Series) -> bool:
    """Check if the column contains array-like values."""
    return column.apply(lambda x: isinstance(x, list) or pd.isna(x)).all()


def is_str_column(column: pd.Series) -> bool:
    """Check if the column contains string-like values."""
    return column.apply(lambda x: isinstance(x, str) or pd.isna(x)).all()


def to_array_column(input: pd.Series, delimiter: str) -> pd.DataFrame:
    """Convert the input column to column of arrays."""
    if is_array_column(input):
        return input
    if is_str_column(input):
        return input.apply(
            lambda value: [
                v if v.strip() != "" else None for v in value.split(delimiter)
            ]
        )
    raise ValueError(_COLUMN_NOT_ARRAY_ERROR)
