"""Utility functions for type checking and conversion."""

from typing import cast

import pandas as pd


def is_array_column(column: pd.Series) -> bool:
    """Check if the column contains array-like values."""
    return bool(column.apply(lambda x: isinstance(x, list) or pd.isna(x)).all())


def is_str_column(column: pd.Series) -> bool:
    """Check if the column contains string-like values."""
    return bool(column.apply(lambda x: isinstance(x, str) or pd.isna(x)).all())


def to_array_column(input: pd.Series, delimiter: str) -> pd.Series:
    """Convert the input column to column of arrays."""
    if is_array_column(input):
        return input
    if is_str_column(input):
        return cast(
            pd.Series,
            input.apply(
                lambda value: [
                    v if v.strip() != "" else None for v in value.split(delimiter)
                ]
            ),
        )
    return cast(pd.Series, input.apply(lambda x: [x] if not pd.isna(x) else []))
