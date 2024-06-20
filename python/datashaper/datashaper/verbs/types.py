#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Common types used across the datashaper codebase."""

from dataclasses import dataclass
from enum import Enum
from typing import Any, Generic, TypeVar

import pandas as pd
from pandas.core.groupby import DataFrameGroupBy

Table = pd.DataFrame | DataFrameGroupBy


class Bin:
    """A data bin."""

    min: float | str
    count: int


class Category:
    """A category data class."""

    name: str
    count: int


class DataType(str, Enum):
    """Data type of a column."""

    Array = "array"
    Boolean = "boolean"
    Date = "date"
    Time = "time"
    Datetime = "datetime"
    Number = "number"
    Integer = "integer"
    String = "string"
    Object = "object"
    Undefined = "undefined"
    Unknown = "unknown"


class JoinStrategy(str, Enum):
    """Table join strategies."""

    Inner = "inner"
    LeftOuter = "left outer"
    RightOuter = "right outer"
    FullOuter = "full outer"
    AntiJoin = "anti join"
    SemiJoin = "semi join"
    Cross = "cross"


@dataclass
class InputColumnArgs:
    """Column argument for verbs operating on a single column."""

    column: str


class FieldAggregateOperation(str, Enum):
    """Aggregate operations for fields."""

    Any = "any"
    Count = "count"
    CountDistinct = "distinct"
    Valid = "valid"
    Invalid = "invalid"
    Max = "max"
    Min = "min"
    Sum = "sum"
    Product = "product"
    Mean = "mean"
    Mode = "mode"
    Median = "median"
    StDev = "stdev"
    StDevPopulation = "stdevp"
    Variance = "variance"
    ArrayAgg = "array_agg"
    ArrayAggDistinct = "array_agg_distinct"


class BinStrategy(str, Enum):
    """Binning strategy to use for the binning operation."""

    Auto = "auto"
    Fd = "fd"
    Doane = "doane"
    Scott = "scott"
    Rice = "rice"
    Sturges = "sturges"
    Sqrt = "sqrt"
    FixedCount = "fixed count"
    FixedWidth = "fixed width"


class ComparisonStrategy(str, Enum):
    """Filter compare type."""

    Value = "value"
    Column = "column"


class NumericComparisonOperator(str, Enum):
    """Numeric comparison operators."""

    Equals = "="
    NotEqual = "!="
    LessThan = "<"
    LessThanOrEqual = "<="
    GreaterThan = ">"
    GreaterThanOrEqual = ">="
    IsEmpty = "is empty"
    IsNotEmpty = "is not empty"


class StringComparisonOperator(str, Enum):
    """String comparison operators."""

    Equals = "equals"
    NotEqual = "is not equal"
    Contains = "contains"
    StartsWith = "starts with"
    EndsWith = "ends with"
    IsEmpty = "is empty"
    IsNotEmpty = "is not empty"
    RegularExpression = "regex"


class BooleanComparisonOperator(str, Enum):
    """Boolean comparison operators."""

    Equals = "equals"
    NotEqual = "is not equal"
    IsTrue = "is true"
    IsFalse = "is false"
    IsEmpty = "is empty"
    IsNotEmpty = "is not empty"


class BooleanLogicalOperator(str, Enum):
    """Boolean logical operators."""

    OR = "or"
    AND = "and"
    NOR = "nor"
    NAND = "nand"
    XOR = "xor"
    XNOR = "xnor"


@dataclass
class FilterArgs(InputColumnArgs):
    """Filter criteria for a column."""

    value: Any
    strategy: ComparisonStrategy
    operator: (
        NumericComparisonOperator | StringComparisonOperator | BooleanComparisonOperator
    )


class SetOp(str, Enum):
    """Set operations for the difference and intersect verbs."""

    Concat = "concat"
    Union = "union"
    Intersect = "intersect"
    Except = "except"


class MathOperator(str, Enum):
    """Mathematical operators."""

    Add = "+"
    Subtract = "-"
    Multiply = "*"
    Divide = "/"
    Concatenate = "concat"


class SortDirection(str, Enum):
    """Sort direction for order by."""

    Ascending = "asc"
    Descending = "desc"


class ParseType(str, Enum):
    """ParseType is used to specify the type of a column."""

    Boolean = "boolean"
    Date = "date"
    Integer = "int"
    Decimal = "float"
    String = "string"
    Array = "array"


class MergeStrategy(str, Enum):
    """Merge strategy for merge verb."""

    FirstOneWins = "first one wins"
    LastOneWins = "last one wins"
    Concat = "concat"
    CreateArray = "array"


class WindowFunction(str, Enum):
    """Windowing functions for window verb."""

    RowNumber = "row_number"
    Rank = "rank"
    PercentRank = "percent_rank"
    CumulativeDistribution = "cume_dist"
    FirstValue = "first_value"
    LastValue = "last_value"
    FillDown = "fill_down"
    FillUp = "fill_up"
    UUID = "uuid"


class FileFormat(str, Enum):
    """File type used for the snapshot verb.."""

    Json = "json"
    Csv = "csv"
    Parquet = "parquet"


@dataclass
class OrderByInstruction:
    """Details regarding how to order a column."""

    column: str
    direction: SortDirection


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


@dataclass
class TableContainer(Generic[T]):
    """A container for a table and its metadata."""

    table: Table
    metadata: TableMetadata | None = None
    context: T | None = None
