#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="lookup", treats_input_tables_as_immutable=True)
def lookup(
    input: VerbInput,
    columns: list[str],
    on: list[str] = None,
):
    input_table: pd.DataFrame = input.get_input()
    other_table: pd.DataFrame = input.get_others()[0]

    if on is not None and len(on) > 1:
        left_column = on[0]
        right_column = on[1]
        other_table = other_table[[right_column] + columns]

        output = input_table.merge(
            other_table.drop_duplicates(subset=on, keep="last"),
            left_on=left_column,
            right_on=right_column,
            how="left",
        )
    else:
        if on is not None:
            other_table = other_table[on + columns]
        output = input_table.merge(
            other_table.drop_duplicates(subset=on, keep="last"),
            on=on,
            how="left",
        )

    return TableContainer(table=output)
