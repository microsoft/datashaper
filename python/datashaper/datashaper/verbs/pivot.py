#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Pivot verb implementation."""


import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .aggregate import aggregate_operation_mapping
from .decorators import OutputMode, wrap_verb_result
from .types import FieldAggregateOperation


@verb(
    name="pivot",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="key", required=True),
        ConfigPort(name="value", required=True),
        ConfigPort(name="operation", required=True),
    ],
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def pivot(table: pd.DataFrame, key: str, value: str, operation: str) -> pd.DataFrame:
    """Pivot verb implementation."""
    aggregate_operation = FieldAggregateOperation(operation)
    return table.pivot_table(
        values=value,
        columns=key,
        aggfunc=aggregate_operation_mapping[aggregate_operation],
    )
