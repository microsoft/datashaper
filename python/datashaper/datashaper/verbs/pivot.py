#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Pivot verb implementation."""

from typing import Any

import pandas as pd

from .aggregate import aggregate_operation_mapping
from .decorators import OutputMode, inputs, outputs, verb
from .types import FieldAggregateOperation


@verb(
    name="pivot",
    immutable_input=True,
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def pivot(
    table: pd.DataFrame, key: str, value: str, operation: str, **_kwargs: Any
) -> pd.DataFrame:
    """Pivot verb implementation."""
    aggregate_operation = FieldAggregateOperation(operation)
    return table.pivot_table(
        values=value,
        columns=key,
        aggfunc=aggregate_operation_mapping[aggregate_operation],
    )
