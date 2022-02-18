#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.join import join
from data_wrangling_components.types import Step, Verb


def test_join():
    step = Step(
        Verb.Join,
        "table1",
        "output",
        args={"other": "table5", "on": ["ID"]},
    )

    store = get_test_store()

    result = join(step, store)

    assert len(result.columns) == 5
    assert len(result) == 6
