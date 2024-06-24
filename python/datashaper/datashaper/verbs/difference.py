#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Difference verb implementation."""

from typing import cast

import pandas as pd
from reactivedataflow import ArrayInputPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .decorators import OutputMode, copy_input_tables, wrap_verb_result


@verb(
    name="difference",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ArrayInputPort(name="others", required=True),
    ],
    adapters=[
        copy_input_tables("table"),
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def difference(table: pd.DataFrame, others: list[pd.DataFrame]) -> pd.DataFrame:
    """Difference verb implementation."""
    output = table.merge(pd.concat(others), how="left", indicator=True)
    output = output[output["_merge"] == "left_only"]
    return cast(pd.DataFrame, output.drop("_merge", axis=1))
