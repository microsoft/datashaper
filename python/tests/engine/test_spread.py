#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.spread import spread
from data_wrangling_components.types import Step, Verb


def test_spread():
    step = Step(
        Verb.Spread,
        "table12",
        "output",
        args={"column": "a", "to": ["first", "second", "third"]},
    )

    store = get_test_store()

    result = spread(step, store)

    assert len(result.columns) == 3
    assert len(result) == 3

    assert result.loc[0, "first"] == 1
    assert result.loc[1, "first"] == 4
    assert result.loc[2, "first"] == 7
