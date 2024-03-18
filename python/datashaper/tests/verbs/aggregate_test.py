import pandas as pd

from datashaper import TableContainer, VerbInput
from datashaper.engine.verbs.aggregate import FieldAggregateOperation, aggregate


def test_aggregate_count():
    data = pd.DataFrame(
        {
            "id": [1, 1, 2, 2, 3],
            "item": ["a", "b", "c", "d", "e"],
        }
    )

    result = aggregate(
        VerbInput(TableContainer(data)),
        column="item",
        to="item_aggregated",
        groupby=["id"],
        operation=FieldAggregateOperation.Count,
    )
    result = result.output.table
    assert result["id"].to_list() == [1, 2, 3]
    assert result["item_aggregated"].to_list() == [2, 2, 1]


def test_aggregate_unique():
    data = pd.DataFrame(
        {
            "id": [1, 1, 2, 2, 3],
            "item": ["a", "b", "c", "d", "e"],
        }
    )

    result = aggregate(
        VerbInput(TableContainer(data)),
        column="item",
        to="item_aggregated",
        groupby=["id"],
        operation=FieldAggregateOperation.ArrayAggDistinct,
    )
    result = result.output.table
    assert result["id"].to_list() == [1, 2, 3]
    assert result["item_aggregated"].to_list() == [["a", "b"], ["c", "d"], ["e"]]
    assert result.get("item") is None
