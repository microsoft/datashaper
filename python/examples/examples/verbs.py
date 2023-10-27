"""Custom verbs for data processing."""
from typing import List

from datashaper import TableContainer, VerbInput


def genid(input: VerbInput, hash: List[str], to: str) -> TableContainer:
    """Generate IDs for each row. A pipeline verb."""
    df = input.source.table.copy()

    def hash_row(row) -> str:
        hashtext = "".join([str(row[column]) for column in hash])
        return f"hash({hashtext})"

    df[to] = df.apply(lambda row: hash_row(row), axis=1)
    return TableContainer(table=df)


def embed(input: VerbInput, column: str, to: str) -> TableContainer:
    """Embed text per row. A pipeline verb."""
    df = input.source.table.copy()
    df[to] = df.apply(lambda row: _embed(row[column]), axis=1)
    return TableContainer(table=df)


def embed_mock(input: VerbInput, column: str, to: str) -> TableContainer:
    """Embed text per row. A pipeline verb."""
    df = input.source.table.copy()
    df[to] = df.apply(lambda row: [0.1, 0.2, 0.3], axis=1)
    return TableContainer(table=df)


def _embed(text: str) -> List[float]:
    """Perform a text embedding."""
    return [0.1, 0.2, 0.3]
