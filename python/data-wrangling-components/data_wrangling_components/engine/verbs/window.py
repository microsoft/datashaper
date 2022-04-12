#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import numpy as np
import pandas as pd

from dataclasses import dataclass
from pandas.core.groupby import DataFrameGroupBy

from data_wrangling_components.table_store import TableContainer, TableStore
from data_wrangling_components.types import (
    InputColumnArgs,
    OutputColumnArgs,
    Step,
    WindowFunction,
)


def _get_window_indexer(
    column: pd.Series, fixed_size=False
) -> pd.api.indexers.BaseIndexer:
    if fixed_size:
        return pd.api.indexers.FixedForwardWindowIndexer(window_size=len(column))
    else:
        return pd.api.indexers.BaseIndexer(window_size=len(column))


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
}


@dataclass
class WindowArgs(InputColumnArgs, OutputColumnArgs):
    operation: WindowFunction


def window(step: Step, store: TableStore):
    args = WindowArgs(
        to=step.args["to"],
        column=step.args["column"],
        operation=WindowFunction(step.args["operation"]),
    )

    input_table = store.table(step.input)
    window = __window_function_map[args.operation](input_table[args.column])

    if isinstance(input_table, DataFrameGroupBy):
        # ungroup table to add new column
        output = input_table.obj.copy()
        output[args.to] = window.reset_index()[args.column]
        # group again by original group by
        output = output.groupby(input_table.keys)
    else:
        output = input_table.copy()
        output[args.to] = window

    return TableContainer(id=step.output, name=step.output, table=output)
