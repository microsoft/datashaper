#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Common types used in DataShaper verbs."""

from .aggregate import aggregate
from .bin import bin
from .binarize import binarize
from .boolean import boolean
from .concat import concat
from .convert import convert
from .copy import copy
from .decorators import VerbInputSpec, parallel_verb, verb
from .dedupe import dedupe
from .derive import derive
from .destructure import destructure
from .difference import difference
from .drop import drop
from .engine import (
    VerbInput,
    VerbManager,
    VerbResult,
    load_verbs,
)
from .erase import erase
from .fill import fill
from .filter import filter, get_comparison_operator
from .fold import fold
from .groupby import groupby
from .impute import impute
from .intersect import intersect
from .join import join
from .lookup import lookup
from .merge import merge
from .onehot import onehot
from .orderby import orderby
from .pivot import pivot
from .print import print
from .recode import recode
from .rename import rename
from .rollup import rollup
from .sample import sample
from .select import select
from .snapshot import snapshot
from .spread import spread
from .strings import lower, replace, upper
from .types import (
    Bin,
    BinStrategy,
    BooleanComparisonOperator,
    BooleanLogicalOperator,
    Category,
    ComparisonStrategy,
    DataType,
    FieldAggregateOperation,
    FileType,
    FilterArgs,
    InputColumnArgs,
    JoinStrategy,
    MathOperator,
    MergeStrategy,
    NumericComparisonOperator,
    OrderByInstruction,
    ParseType,
    SetOp,
    SortDirection,
    StringComparisonOperator,
    WindowFunction,
)
from .unfold import unfold
from .ungroup import ungroup
from .unhot import unhot
from .union import union
from .unorder import unorder
from .unroll import unroll
from .window import window
from .workflow import workflow

__all__ = [
    # Verbs
    "aggregate",
    "bin",
    "binarize",
    "boolean",
    "concat",
    "convert",
    "copy",
    "dedupe",
    "derive",
    "destructure",
    "difference",
    "drop",
    "erase",
    "fill",
    "filter",
    "get_comparison_operator",
    "fold",
    "groupby",
    "impute",
    "intersect",
    "join",
    "lookup",
    "merge",
    "onehot",
    "orderby",
    "pivot",
    "print",
    "recode",
    "rename",
    "rollup",
    "sample",
    "select",
    "snapshot",
    "spread",
    "unfold",
    "ungroup",
    "unhot",
    "union",
    "unorder",
    "unroll",
    "window",
    "workflow",
    "upper",
    "lower",
    "replace",
    # Verb Authoring
    "VerbInput",
    "VerbResult",
    "VerbManager",
    "load_verbs",
    # Decorators
    "VerbInputSpec",
    "verb",
    "parallel_verb",
    # Enums,
    "Bin",
    "BinStrategy",
    "BooleanComparisonOperator",
    "BooleanLogicalOperator",
    "Category",
    "ComparisonStrategy",
    "DataType",
    "FieldAggregateOperation",
    "FileType",
    "FilterArgs",
    "InputColumnArgs",
    "JoinStrategy",
    "MathOperator",
    "MergeStrategy",
    "NumericComparisonOperator",
    "OrderByInstruction",
    "ParseType",
    "SetOp",
    "SortDirection",
    "StringComparisonOperator",
    "WindowFunction",
]
