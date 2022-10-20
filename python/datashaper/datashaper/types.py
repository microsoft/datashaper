#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Common types used across the datashaper codebase."""

from enum import Enum
from typing import Any, Dict, List, Union

from dataclasses import dataclass, field


class Verb(Enum):
    """The verbs that can be used in a pipeline."""

    Aggregate = "aggregate"
    Bin = "bin"
    Binarize = "binarize"
    Boolean = "boolean"
    Chain = "chain"
    Concat = "concat"
    Convert = "convert"
    Dedupe = "dedupe"
    Derive = "derive"
    Difference = "difference"
    Erase = "erase"
    Fill = "fill"
    Filter = "filter"
    FilterAggregateLookup = "filter-aggregate-lookup"
    Fold = "fold"
    Groupby = "groupby"
    Impute = "impute"
    Intersect = "intersect"
    Join = "join"
    Lookup = "lookup"
    Merge = "merge"
    MultiBinarize = "multi-binarize"
    OneHot = "onehot"
    Orderby = "orderby"
    Pivot = "pivot"
    Recode = "recode"
    Rename = "rename"
    Rollup = "rollup"
    Sample = "sample"
    Select = "select"
    Spread = "spread"
    Unfold = "unfold"
    Ungroup = "ungroup"
    Unhot = "unhot"
    Union = "union"
    Unorder = "unorder"
    Unroll = "unroll"
    Window = "window"


compound_verbs = {Verb.Chain, Verb.FilterAggregateLookup, Verb.MultiBinarize}


class Bin:
    """A data bin."""

    min: Union[float, str]
    count: int


class Category:
    """A category data class."""

    name: str
    count: int


@dataclass
class DataType(Enum):
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

    verb: Verb
    input: Union[str, Dict[str, str]]
    output: Union[str, Dict[str, str]]
    args: Dict[str, Any] = field(default_factory=dict)


class JoinStrategy(Enum):
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
    """Column argument for verbs oberating on a single column."""

    column: str


class FieldAggregateOperation(Enum):
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
    ArraryAgg = "array_agg"
    ArrayAggDistinct = "array_agg_distinct"


class BinStrategy(Enum):
    """Binning strategy to use for the binning operation."""

    Auto = "auto"
    FixedCount = "fixed count"
    FixedWidth = "fixed width"


class FilterCompareType(Enum):
    """Filter compare type."""

    Value = "value"
    Column = "column"


class NumericComparisonOperator(Enum):
    """Numeric comparison operators."""

    Equals = "="
    NotEqual = "!="
    LessThan = "<"
    LessThanOrEqual = "<="
    GreaterThan = ">"
    GreaterThanOrEqual = ">="
    IsEmpty = "is empty"
    IsNotEmpty = "is not empty"


class StringComparisonOperator(Enum):
    """String comparison operators."""

    Equals = "equals"
    NotEqual = "is not equal"
    Contains = "contains"
    StartsWith = "starts with"
    EndsWith = "ends with"
    IsEmpty = "is empty"
    IsNotEmpty = "is not empty"
    RegularExpression = "regex"


class BooleanComparisonOperator(Enum):
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


class BooleanLogicalOperator(Enum):
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

    criteria: List[Criterion]
    logical: BooleanLogicalOperator = BooleanLogicalOperator.OR


class SetOp(Enum):
    """Set operations for the difference and intersect verbs."""

    Concat = "concat"
    Union = "union"
    Intersect = "intersect"
    Except = "except"


class MathOperator(Enum):
    """Mathematical operators."""

    Add = "+"
    Subtract = "-"
    Multiply = "*"
    Divide = "/"
    Concatenate = "concat"


class SortDirection(Enum):
    """Sort direction for order by."""

    Ascending = "asc"
    Descending = "desc"


class ParseType(Enum):
    """ParseType is used to specify the type of a column."""

    Boolean = "boolean"
    Date = "date"
    Integer = "int"
    Decimal = "float"
    String = "string"


class MergeStrategy(Enum):
    """Merge strategy for merge verb."""

    FirstOneWins = "first one wins"
    LastOneWins = "last one wins"
    Concat = "concat"
    CreateArray = "array"


class WindowFunction(Enum):
    """Windowing functions for window verb."""

    RowNumber = "row_number"
    Rank = "rank"
    PercentRank = "percent_rank"
    CumulativeDistribution = "cume_dist"
    FirstValue = "first_value"
    LastValue = "last_value"
    FillDown = "fill_down"
    FillUp = "fill_up"


@dataclass
class OrderByInstruction:
    """Details regarding how to order a column."""

    column: str
    direction: SortDirection
