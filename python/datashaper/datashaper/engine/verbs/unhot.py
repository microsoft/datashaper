"""Unhot verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.verbs.utils import unhot_operation
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="unhot")
def unhot(
    input: VerbInput,
    to: str,
    columns: list[str],
    preserveSource: bool = False,  # noqa: N803
    prefix: str = "",
    **_kwargs: dict,
) -> VerbResult:
    """Unhot verb implementation."""
    input_table = cast(pd.DataFrame, input.get_input())
    output_table = unhot_operation(input_table, columns, to, prefix)

    if preserveSource:
        id_vars = [col for col in input_table.columns if col not in columns]
        output_table.drop(columns=id_vars, inplace=True)
        output_table = pd.concat([input_table, output_table], axis=1)
        for column in output_table.columns:
            if column.startswith(prefix):
                output_table[column] = output_table[column].apply(
                    lambda x, column=column: column.split(prefix)[1]
                    if x == 1
                    else pd.NA
                )

    return create_verb_result(cast(pd.DataFrame, output_table))
