#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.orderby import orderby
from data_wrangling_components.types import SortDirection, Step, Verb


def test_orderby_asc_string():
    step = Step(
        Verb.Orderby,
        "table7",
        "output",
        args={"orders": [{"column": "item", "direction": SortDirection.Ascending}]},
    )

    store = get_test_store()

    result = orderby(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5

    assert result.iloc[0]["item"] == "bed"
    assert result.iloc[1]["item"] == "chair"
    assert result.iloc[2]["item"] == "pillow"
    assert result.iloc[3]["item"] == "sofa"
    assert result.iloc[4]["item"] == "stool"


def test_orderby_desc_string():
    step = Step(
        Verb.Orderby,
        "table7",
        "output",
        args={"orders": [{"column": "item", "direction": SortDirection.Descending}]},
    )

    store = get_test_store()

    result = orderby(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5

    assert result.iloc[0]["item"] == "stool"
    assert result.iloc[1]["item"] == "sofa"
    assert result.iloc[2]["item"] == "pillow"
    assert result.iloc[3]["item"] == "chair"
    assert result.iloc[4]["item"] == "bed"


def test_orderby_asc_number():
    step = Step(
        Verb.Orderby,
        "table7",
        "output",
        args={"orders": [{"column": "quantity", "direction": SortDirection.Ascending}]},
    )

    store = get_test_store()

    result = orderby(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5

    assert result.iloc[0]["quantity"] == 45
    assert result.iloc[1]["quantity"] == 50
    assert result.iloc[2]["quantity"] == 78
    assert result.iloc[3]["quantity"] == 89
    assert result.iloc[4]["quantity"] == 100


def test_orderby_desc_number():
    step = Step(
        Verb.Orderby,
        "table7",
        "output",
        args={
            "orders": [{"column": "quantity", "direction": SortDirection.Descending}]
        },
    )

    store = get_test_store()

    result = orderby(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5

    assert result.iloc[0]["quantity"] == 100
    assert result.iloc[1]["quantity"] == 89
    assert result.iloc[2]["quantity"] == 78
    assert result.iloc[3]["quantity"] == 50
    assert result.iloc[4]["quantity"] == 45
