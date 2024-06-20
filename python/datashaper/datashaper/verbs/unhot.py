"""Unhot verb implementation."""

from typing import Any, cast

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="unhot",
    adapters=[
        inputs(default_input_argname="table"),
        outputs(mode=OutputMode.Table),
    ],
)
def unhot(
    table: pd.DataFrame,
    to: str,
    columns: list[str],
    preserveSource: bool = False,  # noqa: N803
    prefix: str = "",
    **_kwargs: Any,
) -> pd.DataFrame:
    """Unhot verb implementation."""
    output_table = _unhot_operation(table, columns, to, prefix)

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

    return cast(pd.DataFrame, output_table)


def _unhot_operation(
    input: pd.DataFrame, columns: list[str], to: str, prefix: str
) -> pd.DataFrame | pd.Series:
    """Unwind one-hot encoding."""
    output = input.copy()

    id_vars = [col for col in output.columns if col not in columns]

    output = output.melt(id_vars=id_vars, var_name=to, value_name="_temp_value")
    output = output[output["_temp_value"] >= 1]
    output.drop(columns=["_temp_value"], inplace=True)
    output[to] = output.loc[:, to].apply(lambda x: x.split(prefix)[1])
    output.reset_index(drop=True, inplace=True)

    return output
