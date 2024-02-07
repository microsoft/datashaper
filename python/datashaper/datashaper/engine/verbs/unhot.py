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
    input_table = input.get_input()
    output_table = unhot_operation(input_table, columns, to, prefix)

    if preserveSource:
        id_vars = [col for col in input_table.columns if col not in columns]
        output_table.drop(columns=id_vars, inplace=True)
        output_table = pd.concat([input_table, output_table], axis=1)
        for column in output_table.columns:
            if column.startswith("Name_"):
                output_table[column] = output_table[column].apply(lambda x: column.split("Name_")[1] if x == 1 else pd.NA)

    return TableContainer(table=output_table)
