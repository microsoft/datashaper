#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.intersect import intersect
from data_wrangling_components.types import Step, Verb


def test_intersect_no_duplicates():
    step = Step(
        Verb.Intersect,
        "table4",
        "output",
        args={"others": ["table5"]},
    )

    store = get_test_store()

    result = intersect(step, store)

    assert len(result.columns) == 3
    assert len(result) == 4

    assert result.loc[0, "ID"] == 1
    assert result.loc[1, "ID"] == 2
    assert result.loc[2, "ID"] == 4
    assert result.loc[3, "ID"] == 4
