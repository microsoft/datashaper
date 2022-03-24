#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.fill import fill
from data_wrangling_components.types import Step, Verb
from tests.engine.test_store import get_test_store


def test_fill_string():
    step = Step(
        Verb.Fill,
        "table1",
        "output",
        args={"to": "newColumn", "value": "false"},
    )

    store = get_test_store()

    result = fill(step, store)

    assert len(result.table.columns) == 4
    assert len(result.table) == 5

    assert result.table.loc[0, "newColumn"] == "false"
    assert result.table.loc[1, "newColumn"] == "false"
    assert result.table.loc[2, "newColumn"] == "false"
    assert result.table.loc[3, "newColumn"] == "false"
    assert result.table.loc[4, "newColumn"] == "false"


def test_fill_number():
    step = Step(
        Verb.Fill,
        "table1",
        "output",
        args={"to": "newColumn", "value": 20},
    )

    store = get_test_store()

    result = fill(step, store)

    assert len(result.table.columns) == 4
    assert len(result.table) == 5

    assert result.table.loc[0, "newColumn"] == 20
    assert result.table.loc[1, "newColumn"] == 20
    assert result.table.loc[2, "newColumn"] == 20
    assert result.table.loc[3, "newColumn"] == 20
    assert result.table.loc[4, "newColumn"] == 20
