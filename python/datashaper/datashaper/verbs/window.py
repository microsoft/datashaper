#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Window verb implementation."""

from typing import Any
from uuid import uuid4

import numpy as np
import pandas as pd
from pandas.core.groupby import DataFrameGroupBy

from .decorators import OutputMode, inputs, outputs, verb
from .types import WindowFunction


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


@verb(
    name="window",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def window(
    table: pd.DataFrame | DataFrameGroupBy,
    column: str,
    to: str,
    operation: str,
    **_kwargs: Any,
) -> pd.DataFrame | DataFrameGroupBy:
    """Apply a window function to a column in a table."""
    window_operation = WindowFunction(operation)
    window = __window_function_map[window_operation](table[column])

    if isinstance(table, DataFrameGroupBy):
        # ungroup table to add new column
        output = table.obj
        output[to] = window.reset_index()[column]
        # group again by original group by
        output = output.groupby(table.keys)
    else:
        output = table
        output[to] = window

    return output
