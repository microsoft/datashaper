#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from pandas.testing import assert_frame_equal

from data_wrangling_components.engine.verbs.orderby import orderby
from data_wrangling_components.engine.verbs.unorder import unorder
from data_wrangling_components.types import SortDirection, Step, Verb
from tests.engine.test_store import get_test_store
from tests.engine.testing import assert_frame_not_equal


def test_unorder_after_orderby_asc_string():
    step = Step(
        Verb.Orderby,
        "table7",
        "output",
        args={"orders": [{"column": "item", "direction": SortDirection.Ascending}]},
    )

    store = get_test_store()

    order_result = orderby(step, store)
    store.set("newTable", order_result)

    step2 = Step(
        Verb.Unorder,
        "newTable",
        "output",
    )

    result = unorder(step2, store)

    assert_frame_not_equal(result.table, order_result)
    assert_frame_equal(result.table, store.table("table7"))


def test_unorder_after_orderby_desc_string():
    step = Step(
        Verb.Orderby,
        "table7",
        "output",
        args={"orders": [{"column": "item", "direction": SortDirection.Descending}]},
    )

    store = get_test_store()

    order_result = orderby(step, store)
    store.set("newTable", order_result)

    step2 = Step(
        Verb.Unorder,
        "newTable",
        "output",
    )

    result = unorder(step2, store)

    assert_frame_not_equal(result.table, order_result)
    assert_frame_equal(result.table, store.table("table7"))


def test_unorder_after_orderby_asc_number():
    step = Step(
        Verb.Orderby,
        "table7",
        "output",
        args={"orders": [{"column": "quantity", "direction": SortDirection.Ascending}]},
    )

    store = get_test_store()

    order_result = orderby(step, store)
    store.set("newTable", order_result)

    step2 = Step(
        Verb.Unorder,
        "newTable",
        "output",
    )

    result = unorder(step2, store)

    assert_frame_not_equal(result.table, order_result)
    assert_frame_equal(result.table, store.table("table7"))


def test_unorder_after_orderby_desc_number():
    step = Step(
        Verb.Orderby,
        "table7",
        "output",
        args={
            "orders": [{"column": "quantity", "direction": SortDirection.Descending}]
        },
    )

    store = get_test_store()

    order_result = orderby(step, store)
    store.set("newTable", order_result)

    step2 = Step(
        Verb.Unorder,
        "newTable",
        "output",
    )

    result = unorder(step2, store)

    assert_frame_not_equal(result.table, order_result)
    assert_frame_equal(result.table, store.table("table7"))
