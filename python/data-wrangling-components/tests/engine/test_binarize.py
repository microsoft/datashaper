#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.binarize import binarize
from data_wrangling_components.types import Step, Verb
from tests.engine.test_store import get_test_store


def test_binarize_numeric_gte():
    step = Step(
        Verb.Binarize,
        "table1",
        "output",
        args={
            "column": "count",
            "criteria": [{"value": 40, "operator": ">=", "type": "value"}],
            "to": "newColumn",
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
            "column": "count",
            "criteria": [{"value": 40, "operator": ">", "type": "value"}],
            "to": "newColumn",
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
            "column": "count",
            "criteria": [{"value": 40, "operator": "<", "type": "value"}],
            "to": "newColumn",
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
            "column": "item",
            "criteria": [{"value": "a", "operator": "ends with", "type": "value"}],
            "to": "newColumn",
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
            "column": "item",
            "criteria": [{"operator": "is empty", "type": "value"}],
            "to": "newColumn",
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
            "column": "item",
            "criteria": [{"value": "so", "operator": "contains", "type": "value"}],
            "to": "newColumn",
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
