#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.concat import concat
from data_wrangling_components.types import Step, Verb


def test_concat():
    step = Step(
        Verb.Concat,
        "table1",
        "output",
        args={"others": ["table2"]},
    )

    store = get_test_store()

    result = concat(step, store)

    assert len(result.columns) == 3
    assert len(result) == 6
    assert result.loc[0, "count"] == 10
    assert result.loc[1, "count"] == 20
    assert result.loc[2, "count"] == 30
    assert result.loc[3, "count"] == 40
    assert result.loc[4, "count"] == 50
    assert result.loc[5, "count"] == 60
