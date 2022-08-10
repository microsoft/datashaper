#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Any, Dict, Generic, List, Optional, TypeVar, Union

import pandas as pd

from dataclasses import dataclass
from pandas.core.groupby import DataFrameGroupBy

from datashaper.types import Bin, Category, DataType


@dataclass
class ColumnStats:
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
    name: str
    type: DataType
    stats: ColumnStats


@dataclass
class TableMetadata:
    rows: int
    cols: int
    columns: Dict[str, ColumnMetadata]


T = TypeVar("T")


Table = Union[pd.DataFrame, DataFrameGroupBy]


@dataclass
class TableContainer(Generic[T]):
    table: Table
    metadata: Optional[TableMetadata] = None
    context: Optional[T] = None
