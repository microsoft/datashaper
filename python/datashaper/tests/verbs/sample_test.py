import polars as pl

from datashaper.engine.verbs import VerbInput, VerbManager
from datashaper.table_store.types import TableContainer, VerbResult


def make_verb_input(data: dict):
    pd_table = pl.DataFrame(data)
    table_container = TableContainer(pd_table)
    return VerbInput(table_container)


def test_sample():
    verb_input = make_verb_input({"id": [1, 2, 3, 4, 5]})
    sample = VerbManager.get().get_verb("sample").func
    output: VerbResult = sample(input=verb_input, size=2)
    assert len(output.output.table) == 2


def test_sample_seed():
    verb_input = make_verb_input({"id": [1, 2, 3, 4, 5]})

    values = None
    for i in range(10):
        sample = VerbManager.get().get_verb("sample").func
        output: VerbResult = sample(input=verb_input, size=2, seed=0xBEEF)
        output = output.output
        ids = output.table["id"].to_list()

        if i == 0:
            values = ids
        else:
            assert len(ids) == len(values)
            assert ids[0] == values[0]
            assert ids[1] == values[1]
