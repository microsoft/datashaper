#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.unroll import unroll
from data_wrangling_components.types import Step, Verb
from tests.engine.test_store import get_test_store


def test_unroll():
    step = Step(
        Verb.Unroll,
        "table1",
        "output",
        args={"columns": ["ID"]},
    )

    store = get_test_store()

    result = unroll(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 5
