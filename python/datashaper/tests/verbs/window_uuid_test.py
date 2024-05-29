import polars as pl

from datashaper.engine.verbs import VerbInput, VerbManager
from datashaper.table_store.types import TableContainer, VerbResult


def make_verb_input(data: dict):
    pd_table = pl.DataFrame(data)
    table_container = TableContainer(pd_table)
    return VerbInput(table_container)


def test_window():
    verb_input = make_verb_input({"id": [1, 2, 3, 4, 5]})
    window = VerbManager.get().get_verb("window").func
    output: VerbResult = window(
        input=verb_input, column="id", to="newColumn", operation="uuid"
    )
    output: TableContainer = output.output
    uuids = output.table["newColumn"].to_list()

    assert len(uuids) == 5
    assert len(output.table) == 5
