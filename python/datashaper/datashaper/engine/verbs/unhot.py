from functools import partial
from typing import List

from datashaper.engine.verbs.utils.merge_utils import __strategy_mapping
from datashaper.engine.verbs.utils.unhot_utils import unhot_operation
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.table_store import TableContainer
from datashaper.types import MergeStrategy


def unhot(
    input: VerbInput,
    to: str,
    columns: List[str],
    preserveSource: bool = False,
    prefix: str = "",
):
    merge_strategy = MergeStrategy(MergeStrategy.FirstOneWins)

    input_table = unhot_operation(input, columns, prefix).get_input()

    output = input_table.copy()

    output[to] = output[columns].apply(
        partial(__strategy_mapping[merge_strategy]), axis=1
    )

    filteredList: list[str] = []

    for col in output.columns:
        try:
            columns.index(col)
        except ValueError:
            filteredList.append(col)

    if not preserveSource:
        output = output[filteredList]

    return TableContainer(table=output)
