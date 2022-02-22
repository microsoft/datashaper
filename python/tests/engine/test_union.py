#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.union import union
from data_wrangling_components.types import Step, Verb


def test_union():
    step = Step(
        Verb.Union,
        "table1",
        "output",
        args={"others": ["table2"]},
    )

    store = get_test_store()

    result = union(step, store)

    assert len(result.columns) == 3
    assert len(result) == 6

    assert result.loc[0, "ID"] == 1
