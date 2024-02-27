"""Custom verbs for data processing."""
from typing import cast

import pandas as pd
from datashaper import TableContainer, VerbInput, verb


@verb(name="genid")
def genid(
    input: VerbInput, hash: list[str], to: str, **_kwargs: dict
) -> TableContainer:
    """Generate IDs for each row. A pipeline verb."""
    table = cast(pd.DataFrame, input.source.table)

    def hash_row(row: pd.Series) -> str:
        hashtext = "".join([str(row[column]) for column in hash])
        return f"hash({hashtext})"

    table[to] = table.apply(lambda row: hash_row(row), axis=1)
    return TableContainer(table=table)


@verb(name="embed")
def embed(input: VerbInput, column: str, to: str, **_kwargs: dict) -> TableContainer:
    """Embed text per row. A pipeline verb."""
    table = cast(pd.DataFrame, input.source.table)
    table[to] = table.apply(lambda row: _embed(row[column]), axis=1)
    return TableContainer(table=table)


@verb(name="embed_mock")
def embed_mock(
    input: VerbInput, column: str, to: str, **_kwargs: dict
) -> TableContainer:
    """Embed text per row. A pipeline verb."""
    table = cast(pd.DataFrame, input.source.table)
    table[to] = table.apply(lambda _row: [0.1, 0.2, 0.3], axis=1)
    return TableContainer(table=table)


def _embed(_text: str) -> list[float]:
    """Perform a text embedding."""
    return [0.1, 0.2, 0.3]
