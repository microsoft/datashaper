#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.impute import impute
from data_wrangling_components.types import Step, Verb
from tests.engine.test_store import get_test_store


def test_impute_with_string():
    step = Step(
        Verb.Impute,
        "table5",
        "output",
        args={"to": "item", "value": "emptyValue"},
    )

    store = get_test_store()

    result = impute(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 6

    assert result.table.loc[0, "item"] == "bed"
    assert result.table.loc[1, "item"] == "emptyValue"
    assert result.table.loc[4, "item"] == "chair"
    assert result.table.loc[5, "item"] == "emptyValue"


def test_impute_with_number():
    step = Step(
        Verb.Impute,
        "table11",
        "output",
        args={"to": "y", "value": 5000},
    )

    store = get_test_store()

    result = impute(step, store)

    assert len(result.table.columns) == 3
    assert len(result.table) == 3

    assert result.table.loc[0, "y"] == 1
    assert result.table.loc[1, "y"] == 5000
    assert result.table.loc[2, "y"] == 1
