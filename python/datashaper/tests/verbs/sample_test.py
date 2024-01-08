import pandas as pd

from datashaper.engine.verbs import VerbInput, VerbManager
from datashaper.table_store import TableContainer


def make_verb_input(data: list, columns: list[str]):
    pd_table = pd.DataFrame(data=data, columns=columns)
    table_container = TableContainer(pd_table)
    return VerbInput(table_container)


def test_sample():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])
    sample = VerbManager.get().get_verb("sample").func
    output = sample(input=verb_input, size=2)
    assert len(output.table) == 2


def test_sample_seed():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])

    values = None
    for i in range(0, 10):
        sample = VerbManager.get().get_verb("sample").func
        output = sample(input=verb_input, size=2, seed=0xBEEF)
        ids = output.table["id"].values

        if i == 0:
            values = ids
        else:
            assert len(ids) == len(values)
            assert ids[0] == values[0]
            assert ids[1] == values[1]
