"""Unhot verb implementation."""

from typing import Any

import pandas as pd

from datashaper.engine.verbs.utils import unhot_operation


def unhot(
    table: pd.DataFrame,
    to: str,
    columns: list[str],
    preserveSource: bool = False,  # noqa: N803
    prefix: str = "",
    **_kwargs: Any,
) -> pd.DataFrame:
    """Unhot verb implementation."""
    output_table = unhot_operation(table, columns, to, prefix)

    if preserveSource:
        id_vars = [col for col in table.columns if col not in columns]
        output_table.drop(columns=id_vars, inplace=True)
        output_table = pd.concat([table, output_table], axis=1)
        for column in output_table.columns:
            if column.startswith(prefix):
                output_table[column] = output_table[column].apply(
                    lambda x, column=column: column.split(prefix)[1]
                    if x == 1
                    else pd.NA
                )

    return output_table
