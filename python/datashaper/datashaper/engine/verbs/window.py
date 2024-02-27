#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Window verb implementation."""

from uuid import uuid4

import numpy as np
import pandas as pd
from pandas.core.groupby import DataFrameGroupBy

from datashaper.engine.types import WindowFunction
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


def _get_window_indexer(
    column: pd.Series, fixed_size: bool = False
) -> int | pd.api.indexers.BaseIndexer:
    if fixed_size:
        return pd.api.indexers.FixedForwardWindowIndexer(window_size=len(column))

    return len(column)


__window_function_map = {
    WindowFunction.RowNumber: lambda column: column.rolling(
        window=_get_window_indexer(column), min_periods=1
    ).count(),
    WindowFunction.Rank: lambda column: column.rolling(
        window=_get_window_indexer(column), min_periods=1
    ).count(),
    WindowFunction.PercentRank: lambda column: (
        column.rolling(window=_get_window_indexer(column), min_periods=1).count() - 1
    )
    / (len(column) - 1),
    WindowFunction.CumulativeDistribution: lambda column: column.rolling(
        window=_get_window_indexer(column), min_periods=1
    ).count()
    / len(column),
    WindowFunction.FirstValue: lambda column: column.rolling(
        window=_get_window_indexer(column), min_periods=1
    ).apply(lambda x: x.iloc[0]),
    WindowFunction.LastValue: lambda column: column.rolling(
        window=_get_window_indexer(column, True),
        min_periods=1,
    ).apply(lambda x: x.iloc[-1]),
    WindowFunction.FillDown: lambda column: column.rolling(
        window=len(column), min_periods=1
    ).apply(lambda x: x.dropna().iloc[-1]),
    WindowFunction.FillUp: lambda column: column.rolling(
        window=_get_window_indexer(column, True),
        min_periods=1,
    ).apply(lambda x: x.dropna().iloc[0] if np.isnan(x.iloc[0]) else x.iloc[0]),
    WindowFunction.UUID: lambda column: column.apply(lambda _x: str(uuid4())),
}


@verb(name="window")
def window(
    input: VerbInput,
    column: str,
    to: str,
    operation: str,
    **_kwargs: dict,
) -> VerbResult:
    """Apply a window function to a column in a table."""
    window_operation = WindowFunction(operation)

    input_table = input.get_input()
    window = __window_function_map[window_operation](input_table[column])

    if isinstance(input_table, DataFrameGroupBy):
        # ungroup table to add new column
        output = input_table.obj
        output[to] = window.reset_index()[column]
        # group again by original group by
        output = output.groupby(input_table.keys)
    else:
        output = input_table
        output[to] = window

    return create_verb_result(output)
