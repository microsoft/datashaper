#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.fetch import fetch
from data_wrangling_components.types import Step, Verb
from tests.engine.test_store import get_test_store


def test_fetch_simple_csv_file():
    step = Step(
        Verb.Fetch,
        "",
        "output",
        args={"url": "../data/companies.csv"},
    )

    store = get_test_store()

    result = fetch(step, store)

    assert len(result.table.columns) == 4
    assert len(result.table) == 5

    assert result.table.loc[0, "ID"] == 1
    assert result.table.loc[0, "Name"] == "Microsoft"
    assert result.table.loc[0, "Employees"] == 160000
    assert result.table.loc[0, "US"]

    assert result.table.loc[1, "ID"] == 2
    assert result.table.loc[1, "Name"] == "Apple"
    assert result.table.loc[1, "Employees"] == 150000
    assert result.table.loc[1, "US"]

    assert result.table.loc[2, "ID"] == 3
    assert result.table.loc[2, "Name"] == "Google"
    assert result.table.loc[2, "Employees"] == 135000
    assert result.table.loc[2, "US"]

    assert result.table.loc[3, "ID"] == 4
    assert result.table.loc[3, "Name"] == "Amazon"
    assert result.table.loc[3, "Employees"] == 1250000
    assert result.table.loc[3, "US"]

    assert result.table.loc[4, "ID"] == 5
    assert result.table.loc[4, "Name"] == "Samsung"
    assert result.table.loc[4, "Employees"] == 270000
    assert not result.table.loc[4, "US"]
