"""Unwind one-hot encoding."""

import polars as pl


def unhot_operation(
    input: pl.DataFrame, columns: list[str], to: str, prefix: str
) -> pl.DataFrame | pl.Series:
    """Unwind one-hot encoding."""
    output = input.clone()

    id_vars = [col for col in output.columns if col not in columns]

    output = output.melt(id_vars=id_vars, var_name=to, value_name="_temp_value")
    output = output[output["_temp_value"] >= 1]
    output.drop(columns=["_temp_value"], inplace=True)
    output[to] = output.loc[:, to].apply(lambda x: x.split(prefix)[1])
    return output
