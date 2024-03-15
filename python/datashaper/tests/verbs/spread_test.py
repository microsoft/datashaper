import pandas as pd

from datashaper import TableContainer, VerbInput
from datashaper.engine.verbs.spread import spread


def test_spread_arraystring():
    data = pd.DataFrame({"id": [1, 2], "values": ["10;15;", "1;11;18"]})

    result = spread(
        VerbInput(TableContainer(data)),
        column="values",
        delimiter=";",
    )
    result = result.output.table
    assert result["id"].to_list() == [1, 2]
    assert result["values_1"].to_list() == ["10", "1"]
    assert result["values_2"].to_list() == ["15", "11"]
    assert result["values_3"].to_list() == [None, "18"]


def test_spread_rawarray():
    data = pd.DataFrame({"id": [1, 2], "values": [[10, 15, None], [1, 11, 18]]})

    result = spread(VerbInput(TableContainer(data)), column="values", delimiter=";")
    result = result.output.table
    assert result["id"].to_list() == [1, 2]
    assert result["values_1"].to_list() == [10, 1]
    assert result["values_2"].to_list() == [15, 11]

    values_3 = result["values_3"].to_list()
    assert len(values_3) == 2
    assert pd.isna(values_3[0])
    assert values_3[1] == 18


def test_spread_to_arraystring():
    data = pd.DataFrame({"id": [1, 2], "values": ["10;15;", "1;11;18"]})

    result = spread(
        VerbInput(TableContainer(data)),
        column="values",
        delimiter=";",
        to=["first", "second"],
    )
    result = result.output.table
    assert result["id"].to_list() == [1, 2]
    assert result["first"].to_list() == ["10", "1"]
    assert result["second"].to_list() == ["15", "11"]


def test_spread_to_rawarray():
    data = pd.DataFrame({"id": [1, 2], "values": [[10, 15, None], [1, 11, 18]]})

    result = spread(
        VerbInput(TableContainer(data)),
        column="values",
        delimiter=";",
        to=["first", "second"],
    )
    result = result.output.table
    assert result["id"].to_list() == [1, 2]
    assert result["first"].to_list() == [10, 1]
    assert result["second"].to_list() == [15, 11]


def test_spreadhot_arraystring():
    data = pd.DataFrame(
        {"id": [1, 2, 3, 4], "values": ["a1;b1;d1", "a1;b1;b2", "b1;a1;c1", "c1;d1;b1"]}
    )

    result = spread(
        VerbInput(TableContainer(data)), column="values", delimiter=";", onehot=True
    )
    result = result.output.table
    assert result["id"].to_list() == [1, 2, 3, 4]
    assert result["values_a1"].to_list() == [1, 1, 1, 0]
    assert result["values_b1"].to_list() == [1, 1, 1, 1]
    assert result["values_b2"].to_list() == [0, 1, 0, 0]
    assert result["values_d1"].to_list() == [1, 0, 0, 1]


def test_spreadhot_rawarray():
    data = pd.DataFrame(
        {
            "id": [1, 2, 3, 4],
            "values": [
                ["a1", "b1", "d1"],
                ["a1", "b1", "b2"],
                ["b1", "a1", "c1"],
                ["c1", "d1", "b1"],
            ],
        }
    )

    result = spread(
        VerbInput(TableContainer(data)), column="values", delimiter=";", onehot=True
    )
    result = result.output.table
    assert result["id"].to_list() == [1, 2, 3, 4]
    assert result["values_a1"].to_list() == [1, 1, 1, 0]
    assert result["values_b1"].to_list() == [1, 1, 1, 1]
    assert result["values_b2"].to_list() == [0, 1, 0, 0]
    assert result["values_d1"].to_list() == [1, 0, 0, 1]
