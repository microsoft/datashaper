#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.spread import spread
from data_wrangling_components.types import Step, Verb
from tests.engine.test_store import get_test_store


def test_spread():
    step = Step(
        Verb.Spread,
        "table12",
        "output",
        args={"column": "a", "to": ["first", "second", "third"]},
    )

    store = get_test_store()

    result = spread(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 3

    assert result.table.loc[0, "first"] == 1
    assert result.table.loc[1, "first"] == 4
    assert result.table.loc[2, "first"] == 7
