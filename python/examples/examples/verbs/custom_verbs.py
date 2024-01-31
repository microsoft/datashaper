"""Custom verbs for data processing."""
from datashaper import TableContainer, VerbInput, verb


@verb(name="genid")
def genid(input: VerbInput, hash: list[str], to: str) -> TableContainer:
    """Generate IDs for each row. A pipeline verb."""
    df = input.source.table

    def hash_row(row) -> str:
        hashtext = "".join([str(row[column]) for column in hash])
        return f"hash({hashtext})"

    df[to] = df.apply(lambda row: hash_row(row), axis=1)
    return TableContainer(table=df)


@verb(name="embed")
def embed(input: VerbInput, column: str, to: str) -> TableContainer:
    """Embed text per row. A pipeline verb."""
    df = input.source.table
    df[to] = df.apply(lambda row: _embed(row[column]), axis=1)
    return TableContainer(table=df)


@verb(name="embed_mock")
def embed_mock(input: VerbInput, column: str, to: str) -> TableContainer:
    """Embed text per row. A pipeline verb."""
    df = input.source.table
    df[to] = df.apply(lambda row: [0.1, 0.2, 0.3], axis=1)
    return TableContainer(table=df)


def _embed(text: str) -> list[float]:
    """Perform a text embedding."""
    return [0.1, 0.2, 0.3]
