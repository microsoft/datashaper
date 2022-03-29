#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.groupby import groupby
from data_wrangling_components.engine.verbs.rollup import rollup
from data_wrangling_components.types import FieldAggregateOperation, Step, Verb
from tests.engine.test_store import get_test_store


def test_rollup_with_count():
    step = Step(
        Verb.Rollup,
        "table3",
        "output",
        args={
            "column": "item",
            "to": "count",
            "operation": FieldAggregateOperation.Count,
        },
    )

    store = get_test_store()

    result = rollup(step, store)

    assert len(result.table.columns) == 1
    assert len(result.table) == 1

    assert result.table.loc[0, "count"] == 6


def test_rollup_with_sum():
    step = Step(
        Verb.Rollup,
        "table4",
        "output",
        args={
            "column": "quantity",
            "to": "total",
            "operation": FieldAggregateOperation.Sum,
        },
    )

    store = get_test_store()

    result = rollup(step, store)

    assert len(result.table.columns) == 1
    assert len(result.table) == 1

    assert result.table.loc[0, "total"] == 407


def test_rollup_with_min():
    step = Step(
        Verb.Rollup,
        "table4",
        "output",
        args={
            "column": "quantity",
            "to": "min",
            "operation": FieldAggregateOperation.Min,
        },
    )

    store = get_test_store()

    result = rollup(step, store)

    assert len(result.table.columns) == 1
    assert len(result.table) == 1

    assert result.table.loc[0, "min"] == 45


def test_group_rollup_with_count():
    step1 = Step(
        Verb.Groupby,
        "table3",
        "output",
        args={"columns": ["item"]},
    )

    store = get_test_store()

    groupby_result = groupby(step1, store)

    store.set("newTable", groupby_result)

    step2 = Step(
        Verb.Rollup,
        "newTable",
        "output",
        args={
            "column": "ID",
            "to": "count",
            "operation": FieldAggregateOperation.Count,
        },
    )

    result = rollup(step2, store)

    assert len(result.table.columns) == 1
    assert len(result.table) == 5

    assert result.table.loc[0, "count"] == 1
    assert result.table.loc[1, "count"] == 1
    assert result.table.loc[2, "count"] == 1
    assert result.table.loc[3, "count"] == 2
    assert result.table.loc[4, "count"] == 1
