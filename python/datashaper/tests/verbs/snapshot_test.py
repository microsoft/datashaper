from pathlib import Path

import polars as pl

from datashaper.engine.verbs import VerbInput, VerbManager
from datashaper.table_store.types import TableContainer, VerbResult


def make_verb_input(data: dict):
    table = pl.DataFrame(data)
    table_container = TableContainer(table)
    return VerbInput(table_container)


def test_snapshot_csv():
    verb_input = make_verb_input({"id": [1, 2, 3, 4, 5]})
    snapshot = VerbManager.get().get_verb("snapshot").func
    output: VerbResult = snapshot(input=verb_input, name="test-file", file_type="csv")
    output: TableContainer = output.output
    p = Path("test-file.csv")
    assert p.exists()
    p.unlink()


def test_snapshot_json():
    verb_input = make_verb_input({"id": [1, 2, 3, 4, 5]})
    snapshot = VerbManager.get().get_verb("snapshot").func
    output: VerbResult = snapshot(input=verb_input, name="test-file", file_type="json")
    output: TableContainer = output.output
    p = Path("test-file.json")
    assert p.exists()
    p.unlink()


def test_snapshot_parquet():
    verb_input = make_verb_input({"id": [1, 2, 3, 4, 5]})
    snapshot = VerbManager.get().get_verb("snapshot").func
    output: VerbResult = snapshot(
        input=verb_input, name="test-file", file_type="parquet"
    )
    output: TableContainer = output.output
    p = Path("test-file.parquet")
    assert p.exists()
    p.unlink()
