import pandas as pd

from datashaper.verbs import window


def make_verb_input(data: list, columns: list[str]):
    return pd.DataFrame(data=data, columns=columns)


def test_window():
    verb_input = make_verb_input([[1], [2], [3], [4], [5]], ["id"])
    output = window(verb_input, column="id", to="newColumn", operation="uuid")
    uuids = output["newColumn"].tolist()

    assert len(uuids) == 5
    assert len(output) == 5
