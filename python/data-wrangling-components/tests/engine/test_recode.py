#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.recode import recode
from data_wrangling_components.types import Step, Verb
from tests.engine.test_store import get_test_store


def test_recode_with_string():
    step = Step(
        Verb.Recode,
        "table1",
        "output",
        args={
            "column": "name",
            "to": "newColumn",
            "map": {"A": "Z", "B": "Y", "C": "X"},
        },
    )

    store = get_test_store()

    result = recode(step, store)

    assert len(result.table.columns) == 4
    assert len(result.table) == 5

    assert result.table.loc[0, "newColumn"] == "Z"
    assert result.table.loc[1, "newColumn"] == "Y"
    assert result.table.loc[2, "newColumn"] == "X"
    assert result.table.loc[3, "newColumn"] == "D"
    assert result.table.loc[4, "newColumn"] == "E"
