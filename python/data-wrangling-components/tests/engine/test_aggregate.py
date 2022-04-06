#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.aggregate import aggregate
from data_wrangling_components.types import FieldAggregateOperation, Step, Verb
from tests.engine.test_store import get_test_store


def test_aggregate_with_count():
    step = Step(
        Verb.Aggregate,
        "table3",
        "output",
        args={
            "to": "newColumn",
            "groupby": "ID",
            "column": "item",
            "operation": FieldAggregateOperation.Count,
        },
    )

    store = get_test_store()

    result = aggregate(step, store)

    assert len(result.table.columns) == 2
    assert len(result.table) == 3
    assert result.table.loc[0, "ID"] == 1
    assert result.table.loc[0, "newColumn"] == 2
    assert result.table.loc[1, "ID"] == 2
    assert result.table.loc[1, "newColumn"] == 1
    assert result.table.loc[2, "ID"] == 4
    assert result.table.loc[2, "newColumn"] == 3


def test_aggregate_with_sum():
    step = Step(
        Verb.Aggregate,
        "table4",
        "output",
        args={
            "to": "newColumn",
            "groupby": "ID",
            "column": "quantity",
            "operation": FieldAggregateOperation.Sum,
        },
    )

    store = get_test_store()

    result = aggregate(step, store)

    assert len(result.table.columns) == 2
    assert len(result.table) == 3
    assert result.table.loc[0, "ID"] == 1
    assert result.table.loc[0, "newColumn"] == 123
    assert result.table.loc[1, "ID"] == 2
    assert result.table.loc[1, "newColumn"] == 100
    assert result.table.loc[2, "ID"] == 4
    assert result.table.loc[2, "newColumn"] == 184


def test_aggregate_with_min():
    step = Step(
        Verb.Aggregate,
        "table4",
        "output",
        args={
            "to": "newColumn",
            "groupby": "ID",
            "column": "quantity",
            "operation": FieldAggregateOperation.Min,
        },
    )

    store = get_test_store()

    result = aggregate(step, store)

    assert len(result.table.columns) == 2
    assert len(result.table) == 3
    assert result.table.loc[0, "ID"] == 1
    assert result.table.loc[0, "newColumn"] == 45
    assert result.table.loc[1, "ID"] == 2
    assert result.table.loc[1, "newColumn"] == 100
    assert result.table.loc[2, "ID"] == 4
    assert result.table.loc[2, "newColumn"] == 45


def test_aggregate_with_median():
    step = Step(
        Verb.Aggregate,
        "table4",
        "output",
        args={
            "to": "newColumn",
            "groupby": "ID",
            "column": "quantity",
            "operation": FieldAggregateOperation.Median,
        },
    )

    store = get_test_store()

    result = aggregate(step, store)

    assert len(result.table.columns) == 2
    assert len(result.table) == 3
    assert result.table.loc[0, "ID"] == 1
    assert result.table.loc[0, "newColumn"] == 61.5
    assert result.table.loc[1, "ID"] == 2
    assert result.table.loc[1, "newColumn"] == 100
    assert result.table.loc[2, "ID"] == 4
    assert result.table.loc[2, "newColumn"] == 50
