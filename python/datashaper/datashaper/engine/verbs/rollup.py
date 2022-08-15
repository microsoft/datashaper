#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Iterable

import pandas as pd

from datashaper.engine.pandas.aggregate_mapping import (
    aggregate_operation_mapping,
)
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.table_store import TableContainer
from datashaper.types import FieldAggregateOperation


def rollup(input: VerbInput, column: str, to: str, operation: str):
    aggregate_operation = FieldAggregateOperation(operation)
    input_table = input.get_input()

    agg_result = input_table.agg(aggregate_operation_mapping[aggregate_operation])[
        column
    ]

    if not isinstance(agg_result, Iterable):
        agg_result = [agg_result]
    if isinstance(agg_result, pd.Series):
        agg_result = agg_result.reset_index(drop=True)

    output = pd.DataFrame({to: agg_result})

    return TableContainer(table=output)
