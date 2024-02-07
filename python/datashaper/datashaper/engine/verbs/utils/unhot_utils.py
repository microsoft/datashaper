"""Unwind one-hot encoding."""
import pandas as pd


def unhot_operation(
    input: pd.DataFrame, columns: list[str], to: str, prefix: str
) -> pd.DataFrame | pd.Series:
    """Unwind one-hot encoding."""
    copyInput = input.copy()

    id_vars = [col for col in copyInput.columns if col not in columns]

    copyInput = copyInput.melt(id_vars=id_vars, var_name=to, value_name="_temp_value")
    copyInput = copyInput[copyInput["_temp_value"] >= 1]
    copyInput.drop(columns=["_temp_value"], inplace=True)
    copyInput[to] = copyInput.loc[:, to].apply(lambda x: x.split(prefix)[1])
    copyInput.reset_index(drop=True, inplace=True)

    return copyInput
