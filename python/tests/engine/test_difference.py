#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.difference import difference
from data_wrangling_components.types import Step, Verb


def test_difference_no_duplicates():
    step = Step(
        Verb.Difference,
        "table1",
        "output",
        args={"others": ["table2"]},
    )

    store = get_test_store()

    result = difference(step, store)

    assert len(result.columns) == 3
    assert len(result) == 5
