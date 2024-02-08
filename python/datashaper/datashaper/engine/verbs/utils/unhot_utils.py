"""Unwind one-hot encoding."""
import pandas as pd


def unhot_operation(
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
