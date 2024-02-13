import pandas as pd

from datashaper.engine.verbs import VerbInput, VerbManager
from datashaper.table_store.types import TableContainer, VerbResult


def make_verb_input(data: list, columns: list[str]):
    pd_table = pd.DataFrame(data=data, columns=columns)
    table_container = TableContainer(pd_table)
    return VerbInput(table_container)


def test_window():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])
    window = VerbManager.get().get_verb("window").func
    output: VerbResult = window(
        input=verb_input, column="id", to="newColumn", operation="uuid"
    )
    output: TableContainer = output.output
    uuids = output.table["newColumn"].tolist()

    assert len(uuids) == 5
    assert len(output.table) == 5
