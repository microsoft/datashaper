#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.sample import sample
from data_wrangling_components.types import Step, Verb
from tests.engine.test_store import get_test_store


def test_sample_proportion():
    step = Step(
        Verb.Sample,
        "table6",
        "output",
        args={"proportion": 0.4},
    )

    store = get_test_store()

    result = sample(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 2


def test_sample_size():
    step = Step(
        Verb.Sample,
        "table6",
        "output",
        args={"size": 4},
    )

    store = get_test_store()

    result = sample(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 4
