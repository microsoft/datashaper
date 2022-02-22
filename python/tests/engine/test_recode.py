#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.recode import recode
from data_wrangling_components.types import Step, Verb


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

    assert len(result.columns) == 4
    assert len(result) == 5

    assert result.loc[0, "newColumn"] == "Z"
    assert result.loc[1, "newColumn"] == "Y"
    assert result.loc[2, "newColumn"] == "X"
    assert result.loc[3, "newColumn"] == "D"
    assert result.loc[4, "newColumn"] == "E"
