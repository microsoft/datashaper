from functools import partial
from typing import cast

import pandas as pd

from datashaper.engine.types import MergeStrategy
from datashaper.engine.verbs.utils import strategy_mapping, unhot_operation
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import Table, TableContainer


@verb(name="unhot")
def unhot(
    input: VerbInput,
    to: str,
    columns: list[str],
    preserveSource: bool = False,
    prefix: str = "",
):
    merge_strategy = MergeStrategy(MergeStrategy.FirstOneWins)

    input_table = unhot_operation(input, columns, prefix).get_input()

    output = cast(pd.DataFrame, input_table)

    output[to] = output[columns].apply(
        partial(strategy_mapping[merge_strategy]), axis=1
    )

    filtered_list: list[str] = []

    for col in output.columns:
        try:
            columns.index(col)
        except ValueError:
            filtered_list.append(col)

    if not preserveSource:
        output = output[filtered_list]

    return TableContainer(table=cast(Table, output))
