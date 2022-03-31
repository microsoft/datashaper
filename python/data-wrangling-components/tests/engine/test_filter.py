#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.filter import filter
from data_wrangling_components.types import (
    FilterCompareType,
    NumericComparisonOperator,
    Step,
    StringComparisonOperator,
    Verb,
)
from tests.engine.test_store import get_test_store


def test_filter_numeric_gte():
    step = Step(
        Verb.Filter,
        "table8",
        "output",
        args={
            "column": "count",
            "operator": NumericComparisonOperator.Gte,
            "type": FilterCompareType.Value,
            "value": 100,
        },
    )

    store = get_test_store()

    result = filter(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 3

    assert result.table.loc[0, "count"] == 100
    assert result.table.loc[1, "count"] == 110
    assert result.table.loc[2, "count"] == 120


def test_filter_numeric_gt():
    step = Step(
        Verb.Filter,
        "table8",
        "output",
        args={
            "column": "count",
            "operator": NumericComparisonOperator.Gt,
            "type": FilterCompareType.Value,
            "value": 100,
        },
    )

    store = get_test_store()

    result = filter(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 2

    assert result.table.loc[0, "count"] == 110
    assert result.table.loc[1, "count"] == 120


def test_filter_numeric_lt():
    step = Step(
        Verb.Filter,
        "table8",
        "output",
        args={
            "to": "",
            "column": "count",
            "operator": NumericComparisonOperator.Lt,
            "type": FilterCompareType.Value,
            "value": 100,
        },
    )

    store = get_test_store()

    result = filter(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 2

    assert result.table.loc[0, "count"] == 80
    assert result.table.loc[1, "count"] == 90


def test_filter_string_equal():
    step = Step(
        Verb.Filter,
        "table8",
        "output",
        args={
            "to": "",
            "column": "name",
            "operator": StringComparisonOperator.Equal,
            "type": FilterCompareType.Value,
            "value": "D",
        },
    )

    store = get_test_store()

    result = filter(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 1

    assert result.table.loc[0, "name"] == "D"


def test_filter_string_empty():
    step = Step(
        Verb.Filter,
        "table5",
        "output",
        args={
            "to": "",
            "column": "item",
            "operator": StringComparisonOperator.Empty,
            "type": FilterCompareType.Value,
        },
    )

    store = get_test_store()

    result = filter(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 2

    assert result.table.loc[0, "quantity"] == 78
    assert result.table.loc[1, "quantity"] == 45


def test_filter_string_contains():
    step = Step(
        Verb.Filter,
        "table3",
        "output",
        args={
            "to": "",
            "column": "item",
            "operator": StringComparisonOperator.Contains,
            "type": FilterCompareType.Value,
            "value": "be",
        },
    )

    store = get_test_store()

    result = filter(step, store)

    assert len(result.table.columns) == 2
    assert len(result.table) == 1

    assert result.table.loc[0, "item"] == "bed"
