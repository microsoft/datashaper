import pandas as pd
import os

from datashaper.engine.verbs import VerbInput, VerbManager
from datashaper.table_store.types import TableContainer, VerbResult


def make_verb_input(data: list, columns: list[str]):
    pd_table = pd.DataFrame(data=data, columns=columns)
    table_container = TableContainer(pd_table)
    return VerbInput(table_container)


def test_snapshot_csv():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])
    snapshot = VerbManager.get().get_verb("snapshot").func
    output: VerbResult = snapshot(input=verb_input, name="test-file", file_type="csv")
    output: TableContainer = output.output
    assert os.path.exists("test-file.csv")
    os.remove("test-file.csv")


def test_snapshot_json():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])
    snapshot = VerbManager.get().get_verb("snapshot").func
    output: VerbResult = snapshot(input=verb_input, name="test-file", file_type="json")
    output: TableContainer = output.output
    assert os.path.exists("test-file.json")
    os.remove("test-file.json")


def test_snapshot_parquet():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])
    snapshot = VerbManager.get().get_verb("snapshot").func
    output: VerbResult = snapshot(
        input=verb_input, name="test-file", file_type="parquet"
    )
    output: TableContainer = output.output
    assert os.path.exists("test-file.parquet")
    os.remove("test-file.parquet")
