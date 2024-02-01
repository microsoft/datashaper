#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Common types used across the datashaper codebase."""

from enum import StrEnum
from typing import Any, Union

from dataclasses import dataclass, field


class Bin:
    """A data bin."""

    min: Union[float, str]
    count: int


class Category:
    """A category data class."""

    name: str
    count: int


class DataType(StrEnum):
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


@dataclass
class Step:
    """A workflow processing step."""

    verb: str
    input: Union[str, dict[str, str]]
    output: Union[str, dict[str, str]]
    args: dict[str, Any] = field(default_factory=dict)


class JoinStrategy(StrEnum):
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


class FieldAggregateOperation(StrEnum):
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


class BinStrategy(StrEnum):
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


class FilterCompareType(StrEnum):
    """Filter compare type."""

    Value = "value"
    Column = "column"


class NumericComparisonOperator(StrEnum):
    """Numeric comparison operators."""

    Equals = "="
    NotEqual = "!="
    LessThan = "<"
    LessThanOrEqual = "<="
    GreaterThan = ">"
    GreaterThanOrEqual = ">="
    IsEmpty = "is empty"
    IsNotEmpty = "is not empty"


class StringComparisonOperator(StrEnum):
    """String comparison operators."""

    Equals = "equals"
    NotEqual = "is not equal"
    Contains = "contains"
    StartsWith = "starts with"
    EndsWith = "ends with"
    IsEmpty = "is empty"
    IsNotEmpty = "is not empty"
    RegularExpression = "regex"


class BooleanComparisonOperator(StrEnum):
    """Boolean comparison operators."""

    Equals = "equals"
    NotEqual = "is not equal"
    IsTrue = "is true"
    IsFalse = "is false"
    IsEmpty = "is empty"
    IsNotEmpty = "is not empty"


@dataclass
class Criterion:
    """A filter criterion."""

    value: Any
    type: FilterCompareType
    operator: Union[
        NumericComparisonOperator, StringComparisonOperator, BooleanComparisonOperator
    ]


class BooleanLogicalOperator(StrEnum):
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

    criteria: list[Criterion]
    logical: BooleanLogicalOperator = BooleanLogicalOperator.OR


class SetOp(StrEnum):
    """Set operations for the difference and intersect verbs."""

    Concat = "concat"
    Union = "union"
    Intersect = "intersect"
    Except = "except"


class MathOperator(StrEnum):
    """Mathematical operators."""

    Add = "+"
    Subtract = "-"
    Multiply = "*"
    Divide = "/"
    Concatenate = "concat"


class SortDirection(StrEnum):
    """Sort direction for order by."""

    Ascending = "asc"
    Descending = "desc"


class ParseType(StrEnum):
    """ParseType is used to specify the type of a column."""

    Boolean = "boolean"
    Date = "date"
    Integer = "int"
    Decimal = "float"
    String = "string"


class MergeStrategy(StrEnum):
    """Merge strategy for merge verb."""

    FirstOneWins = "first one wins"
    LastOneWins = "last one wins"
    Concat = "concat"
    CreateArray = "array"


class WindowFunction(StrEnum):
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


@dataclass
class OrderByInstruction:
    """Details regarding how to order a column."""

    column: str
    direction: SortDirection
