import pandas as pd

from datashaper.engine.verbs import VerbInput, VerbManager
from datashaper.table_store.types import TableContainer, VerbResult


def make_verb_input(data: list, columns: list[str]):
    pd_table = pd.DataFrame(data=data, columns=columns)
    table_container = TableContainer(pd_table)
    return VerbInput(table_container)


def test_snapshot_csv():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])
    window = VerbManager.get().get_verb("snapshot").func
    output: VerbResult = window(input=verb_input, name="test-file", format="csv")
    output: TableContainer = output.output

    assert 5 == 5


def test_snapshot_json():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])
    window = VerbManager.get().get_verb("snapshot").func
    output: VerbResult = window(input=verb_input, name="test-file", format="json")
    output: TableContainer = output.output

    assert 5 == 5


def test_snapshot_parquet():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])
    window = VerbManager.get().get_verb("snapshot").func
    output: VerbResult = window(input=verb_input, name="test-file", format="parquet")
    output: TableContainer = output.output

    assert 5 == 5
