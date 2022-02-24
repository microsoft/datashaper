#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.fill import fill
from data_wrangling_components.types import Step, Verb


def test_fill_string():
    step = Step(
        Verb.Fill,
        "table1",
        "output",
        args={"to": "newColumn", "value": "false"},
    )

    store = get_test_store()

    result = fill(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5

    assert result.loc[0, "newColumn"] == "false"
    assert result.loc[1, "newColumn"] == "false"
    assert result.loc[2, "newColumn"] == "false"
    assert result.loc[3, "newColumn"] == "false"
    assert result.loc[4, "newColumn"] == "false"


def test_fill_number():
    step = Step(
        Verb.Fill,
        "table1",
        "output",
        args={"to": "newColumn", "value": 20},
    )

    store = get_test_store()

    result = fill(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5

    assert result.loc[0, "newColumn"] == 20
    assert result.loc[1, "newColumn"] == 20
    assert result.loc[2, "newColumn"] == 20
    assert result.loc[3, "newColumn"] == 20
    assert result.loc[4, "newColumn"] == 20
