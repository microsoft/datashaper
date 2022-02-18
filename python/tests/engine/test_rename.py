#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.rename import rename
from data_wrangling_components.types import Step, Verb


def test_rename():
    step = Step(
        Verb.Rename,
        "table7",
        "output",
        args={
            "columns": {
                "ID": "uuid",
                "item": "product",
                "quantity": "amount",
                "totalSale": "total",
            }
        },
    )

    store = get_test_store()

    result = rename(step, store)

    assert len(result.columns) == 4
    assert len(result) == 5

    assert result.loc[0, "uuid"] == 1
    assert result.loc[0, "product"] == "bed"
    assert result.loc[0, "amount"] == 45
    assert result.loc[0, "total"] == 54000
