#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.dedupe import dedupe
from data_wrangling_components.types import Step, Verb
from tests.engine.test_store import get_test_store


def test_dedupe_with_column():
    step = Step(
        Verb.Dedupe,
        "table3",
        "output",
        args={"columns": ["ID"]},
    )

    store = get_test_store()

    result = dedupe(step, store)

    assert len(result.table.columns) == 2
    assert len(result.table) == 3


def test_dedupe_without_column():
    step = Step(
        Verb.Dedupe,
        "table10",
        "output",
        args={},
    )

    store = get_test_store()

    result = dedupe(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 2

    assert result.table.loc[0, "x"] == "A"
    assert result.table.loc[1, "x"] == "B"
    assert result.table.loc[0, "y"] == 1
    assert result.table.loc[1, "y"] == 2
    assert result.table.loc[0, "z"] == 4
    assert result.table.loc[1, "z"] == 5
