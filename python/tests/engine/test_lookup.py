#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.lookup import lookup
from data_wrangling_components.types import Step, Verb


def test_lookup():
    step = Step(
        Verb.Lookup,
        "table1",
        "output",
        args={"other": "table5", "on": ["ID"], "columns": ["item"]},
    )

    store = get_test_store()

    result = lookup(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5
