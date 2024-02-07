#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""The tablestore module contains the table store classes used by the datashaper."""

from dataclasses import dataclass
from typing import Any, Generic, TypeVar

import pandas as pd
from pandas.core.groupby import DataFrameGroupBy

from datashaper.engine.types import Bin, Category, DataType


@dataclass
class ColumnStats:
    """Generated column statistics."""

    type: DataType
    count: int
    distinct: int
    invalid: int
    mode: Any
    min: float | None = None
    max: float | None = None
    mean: float | None = None
    median: float | None = None
    stdev: float | None = None
    bins: list[Bin] | None = None
    categories: list[Category] | None = None


@dataclass
class ColumnMetadata:
    """Column metadata container."""

    name: str
    type: DataType
    stats: ColumnStats


@dataclass
class TableMetadata:
    """Table metadata container."""

    rows: int
    cols: int
    columns: dict[str, ColumnMetadata]


T = TypeVar("T")


Table = pd.DataFrame | DataFrameGroupBy


@dataclass
class TableContainer(Generic[T]):
    """A container for a table and its metadata."""

    table: Table
    metadata: TableMetadata | None = None
    context: T | None = None
