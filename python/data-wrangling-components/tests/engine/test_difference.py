#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.difference import difference
from data_wrangling_components.types import Step, Verb
from tests.engine.test_store import get_test_store


def test_difference_no_duplicates():
    step = Step(
        Verb.Difference,
        "table1",
        "output",
        args={"others": ["table2"]},
    )

    store = get_test_store()

    result = difference(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 5
