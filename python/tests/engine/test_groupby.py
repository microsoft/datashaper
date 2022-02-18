#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from pandas.core.groupby import DataFrameGroupBy
from pandas.testing import assert_frame_equal

from tests.engine.test_store import get_test_store
from data_wrangling_components.engine.verbs.groupby import groupby
from data_wrangling_components.types import Step, Verb


def test_groupby():
    step1 = Step(
        Verb.Groupby,
        "table10",
        "output",
        args={"columns": ["x", "y"]},
    )

    store = get_test_store()

    result = groupby(step1, store)

    assert isinstance(result, DataFrameGroupBy)

    assert_frame_equal(result.obj, store.get("table10"))
