"""Custom verbs for data processing."""

import pandas as pd
from datashaper.verbs import (
    OutputReturnType,
    inputs,
    outputs,
    verb,
)


@verb(name="genid")
@inputs(default_input_argname="table")
@outputs(return_type=OutputReturnType.Table)
def genid(
    table: pd.DataFrame, hash: list[str], to: str, **_kwargs: dict
) -> pd.DataFrame:
    """Generate IDs for each row. A pipeline verb."""

    def hash_row(row: pd.Series) -> str:
        hashtext = "".join([str(row[column]) for column in hash])
        return f"hash({hashtext})"

    table[to] = table.apply(lambda row: hash_row(row), axis=1)
    return table


@verb(name="embed")
@inputs(default_input_argname="table")
@outputs(return_type=OutputReturnType.Table)
def embed(table: pd.DataFrame, column: str, to: str, **_kwargs: dict) -> pd.DataFrame:
    """Embed text per row. A pipeline verb."""
    table[to] = table.apply(lambda row: _embed(row[column]), axis=1)
    return table


@verb(name="embed_mock")
@inputs(default_input_argname="table")
@outputs(return_type=OutputReturnType.Table)
def embed_mock(
    table: pd.DataFrame, column: str, to: str, **_kwargs: dict
) -> pd.DataFrame:
    """Embed text per row. A pipeline verb."""
    table[to] = table.apply(lambda _row: [0.1, 0.2, 0.3], axis=1)
    return table


def _embed(_text: str) -> list[float]:
    """Perform a text embedding."""
    return [0.1, 0.2, 0.3]
