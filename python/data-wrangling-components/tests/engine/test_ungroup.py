#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.groupby import groupby
from data_wrangling_components.engine.verbs.ungroup import ungroup
from data_wrangling_components.types import Step, Verb
from tests.engine.test_store import get_test_store


def test_ungroup():
    step1 = Step(
        Verb.Groupby,
        "table10",
        "output",
        args={"columns": ["x", "y"]},
    )

    store = get_test_store()

    groupby_result = groupby(step1, store)

    store.set("newTable", groupby_result)

    step2 = Step(
        Verb.Ungroup,
        "newTable",
        "output",
    )

    result = ungroup(step2, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 3

    assert result.table.loc[0, "x"] == "A"
    assert result.table.loc[1, "x"] == "B"
    assert result.table.loc[2, "x"] == "A"
