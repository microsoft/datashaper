#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.binarize import binarize
from data_wrangling_components.types import (
    FilterCompareType,
    NumericComparisonOperator,
    Step,
    StringComparisonOperator,
    Verb,
)
from tests.engine.test_store import get_test_store


def test_binarize_numeric_gte():
    step = Step(
        Verb.Binarize,
        "table1",
        "output",
        args={
            "to": "newColumn",
            "column": "count",
            "operator": NumericComparisonOperator.Gte,
            "type": FilterCompareType.Value,
            "value": 40,
        },
    )

    store = get_test_store()

    result = binarize(step, store)

    assert len(result.table.columns) == 4
    assert len(result.table) == 5
    assert result.table.loc[0, "newColumn"] == 0
    assert result.table.loc[1, "newColumn"] == 0
    assert result.table.loc[2, "newColumn"] == 0
    assert result.table.loc[3, "newColumn"] == 1
    assert result.table.loc[4, "newColumn"] == 1


def test_binarize_numeric_gt():
    step = Step(
        Verb.Binarize,
        "table1",
        "output",
        args={
            "to": "newColumn",
            "column": "count",
            "operator": NumericComparisonOperator.Gt,
            "type": FilterCompareType.Value,
            "value": 40,
        },
    )

    store = get_test_store()

    result = binarize(step, store)

    assert len(result.table.columns) == 4
    assert len(result.table) == 5
    assert result.table.loc[0, "newColumn"] == 0
    assert result.table.loc[1, "newColumn"] == 0
    assert result.table.loc[2, "newColumn"] == 0
    assert result.table.loc[3, "newColumn"] == 0
    assert result.table.loc[4, "newColumn"] == 1


def test_binarize_numeric_lt():
    step = Step(
        Verb.Binarize,
        "table1",
        "output",
        args={
            "to": "newColumn",
            "column": "count",
            "operator": NumericComparisonOperator.Lt,
            "type": FilterCompareType.Value,
            "value": 40,
        },
    )

    store = get_test_store()

    result = binarize(step, store)

    assert len(result.table.columns) == 4
    assert len(result.table) == 5
    assert result.table.loc[0, "newColumn"] == 1
    assert result.table.loc[1, "newColumn"] == 1
    assert result.table.loc[2, "newColumn"] == 1
    assert result.table.loc[3, "newColumn"] == 0
    assert result.table.loc[4, "newColumn"] == 0


def test_binarize_string_endswith():
    step = Step(
        Verb.Binarize,
        "table4",
        "output",
        args={
            "to": "newColumn",
            "column": "item",
            "operator": StringComparisonOperator.EndsWith,
            "type": FilterCompareType.Value,
            "value": "a",
        },
    )

    store = get_test_store()

    result = binarize(step, store)

    assert len(result.table.columns) == 4
    assert len(result.table) == 6
    assert result.table.loc[0, "newColumn"] == 0
    assert result.table.loc[1, "newColumn"] == 0
    assert result.table.loc[2, "newColumn"] == 1
    assert result.table.loc[3, "newColumn"] == 1
    assert result.table.loc[4, "newColumn"] == 0
    assert result.table.loc[5, "newColumn"] == 0


def test_binarize_string_empty():
    step = Step(
        Verb.Binarize,
        "table5",
        "output",
        args={
            "to": "newColumn",
            "column": "item",
            "operator": StringComparisonOperator.Empty,
            "type": FilterCompareType.Value,
        },
    )

    store = get_test_store()

    result = binarize(step, store)

    assert len(result.table.columns) == 4
    assert len(result.table) == 6
    assert result.table.loc[0, "newColumn"] == 0
    assert result.table.loc[1, "newColumn"] == 1
    assert result.table.loc[2, "newColumn"] == 0
    assert result.table.loc[3, "newColumn"] == 0
    assert result.table.loc[4, "newColumn"] == 0
    assert result.table.loc[5, "newColumn"] == 1


def test_binarize_string_contains():
    step = Step(
        Verb.Binarize,
        "table5",
        "output",
        args={
            "to": "newColumn",
            "column": "item",
            "operator": StringComparisonOperator.Contains,
            "type": FilterCompareType.Value,
            "value": "so",
        },
    )

    store = get_test_store()

    result = binarize(step, store)

    assert len(result.table.columns) == 4
    assert len(result.table) == 6
    assert result.table.loc[0, "newColumn"] == 0
    assert result.table.loc[1, "newColumn"] == 0
    assert result.table.loc[2, "newColumn"] == 1
    assert result.table.loc[3, "newColumn"] == 1
    assert result.table.loc[4, "newColumn"] == 0
    assert result.table.loc[5, "newColumn"] == 0
