#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.bin import bin
from data_wrangling_components.types import BinStrategy, Step, Verb
from tests.engine.test_store import get_test_store


def test_bin_with_fixed_count():
    step = Step(
        Verb.Bin,
        "table9",
        "output",
        args={
            "to": "newColumn",
            "column": "count",
            "strategy": BinStrategy.FixedCount,
            "fixedcount": 5,
        },
    )

    store = get_test_store()

    result = bin(step, store)
    b = result.table["newColumn"].unique()
    assert len(b) == 6
    assert b[0] == 10
    assert b[1] == 48
    assert b[5] == 200


def test_bin_with_fixed_width():
    step = Step(
        Verb.Bin,
        "table9",
        "output",
        args={
            "to": "newColumn",
            "column": "count",
            "strategy": BinStrategy.FixedWidth,
            "fixedwidth": 30,
        },
    )

    store = get_test_store()

    result = bin(step, store)
    b = result.table["newColumn"].unique()
    assert len(b) == 7
    assert b[0] == 10
    assert b[1] == 40
