#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.fold import fold
from data_wrangling_components.types import Step, Verb


def test_fold_one_column():
    step = Step(
        Verb.Difference,
        "table1",
        "output",
        args={"to": ["key", "value"], "columns": ["ID"]},
    )

    store = get_test_store()

    result = fold(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5

    assert result.loc[0, "name"] == "A"
    assert result.loc[0, "count"] == 10
    assert result.loc[0, "key"] == "ID"
    assert result.loc[0, "value"] == 1


def test_fold_two_columns():
    step = Step(
        Verb.Fold,
        "table1",
        "output",
        args={"to": ["key", "value"], "columns": ["ID", "name"]},
    )

    store = get_test_store()

    result = fold(step, store)

    assert len(result.columns) == 3
    assert len(result) == 10

    assert result.loc[0, "count"] == 10
    assert result.loc[0, "key"] == "ID"
    assert result.loc[0, "value"] == 1

    assert result.loc[1, "count"] == 10
    assert result.loc[1, "key"] == "name"
    assert result.loc[1, "value"] == "A"
