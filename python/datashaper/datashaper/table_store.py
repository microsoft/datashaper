#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""The tablestore module contains the table store classes used by the datashaper."""

from dataclasses import dataclass
from typing import Any, Dict, Generic, List, Optional, TypeVar, Union

import pandas as pd
from pandas.core.groupby import DataFrameGroupBy

from python.datashaper.datashaper.engine.types import Bin, Category, DataType


@dataclass
class ColumnStats:
    """Generated column statistics."""

    type: DataType
    count: int
    distinct: int
    invalid: int
    mode: Any
    min: Optional[float] = None
    max: Optional[float] = None
    mean: Optional[float] = None
    median: Optional[float] = None
    stdev: Optional[float] = None
    bins: Optional[List[Bin]] = None
    categories: Optional[List[Category]] = None


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
    columns: Dict[str, ColumnMetadata]


T = TypeVar("T")


Table = Union[pd.DataFrame, DataFrameGroupBy]


@dataclass
class TableContainer(Generic[T]):
    """A container for a table and its metadata."""

    table: Table
    metadata: Optional[TableMetadata] = None
    context: Optional[T] = None
