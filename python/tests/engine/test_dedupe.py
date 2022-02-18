#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.dedupe import dedupe
from data_wrangling_components.types import Step, Verb


def test_dedupe_with_column():
    step = Step(
        Verb.Dedupe,
        "table3",
        "output",
        args={"columns": ["ID"]},
    )

    store = get_test_store()

    result = dedupe(step, store)

    assert len(result.columns) == 2
    assert len(result) == 3


def test_dedupe_without_column():
    step = Step(
        Verb.Dedupe,
        "table10",
        "output",
        args={},
    )

    store = get_test_store()

    result = dedupe(step, store)

    assert len(result.columns) == 3
    assert len(result) == 2

    assert result.loc[0, "x"] == "A"
    assert result.loc[1, "x"] == "B"
    assert result.loc[0, "y"] == 1
    assert result.loc[1, "y"] == 2
    assert result.loc[0, "z"] == 4
    assert result.loc[1, "z"] == 5
