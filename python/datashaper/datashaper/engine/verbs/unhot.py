from functools import partial
from typing import List

from ...table_store import TableContainer
from ..types import MergeStrategy
from .utils.merge_utils import strategy_mapping
from .utils.unhot_utils import unhot_operation
from .verb_input import VerbInput


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

    return TableContainer(table=output)
