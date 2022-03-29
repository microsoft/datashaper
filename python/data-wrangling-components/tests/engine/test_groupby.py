#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from pandas.core.groupby import DataFrameGroupBy
from pandas.testing import assert_frame_equal

from data_wrangling_components.engine.verbs.groupby import groupby
from data_wrangling_components.types import Step, Verb
from tests.engine.test_store import get_test_store


def test_groupby():
    step1 = Step(
        Verb.Groupby,
        "table10",
        "output",
        args={"columns": ["x", "y"]},
    )

    store = get_test_store()

    result = groupby(step1, store)

    assert isinstance(result.table, DataFrameGroupBy)

    assert_frame_equal(result.table.obj, store.table("table10"))
