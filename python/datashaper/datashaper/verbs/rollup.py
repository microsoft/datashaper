#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Rollup verb implementation."""

from collections.abc import Iterable

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper import DEFAULT_INPUT_NAME

from .aggregate import aggregate_operation_mapping
from .decorators import OutputMode, wrap_verb_result
from .types import FieldAggregateOperation


@verb(
    name="rollup",
    ports=[
        InputPort(name=DEFAULT_INPUT_NAME, parameter="table", required=True),
        ConfigPort(name="column", required=True),
        ConfigPort(name="to", required=True),
        ConfigPort(name="operation", required=True),
    ],
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
def rollup(table: pd.DataFrame, column: str, to: str, operation: str) -> pd.DataFrame:
    """Rollup verb implementation."""
    aggregate_operation = FieldAggregateOperation(operation)

    agg_result = table[column].agg(aggregate_operation_mapping[aggregate_operation])

    if not isinstance(agg_result, Iterable):
        agg_result = [agg_result]
    if isinstance(agg_result, pd.Series):
        agg_result = agg_result.reset_index(drop=True)

    return pd.DataFrame({to: agg_result})
