import pandas as pd

from datashaper.verbs import FieldAggregateOperation, aggregate


def test_aggregate_count():
    data = pd.DataFrame(
        {
            "id": [1, 1, 2, 2, 3],
            "item": ["a", "b", "c", "d", "e"],
        }
    )

    result = aggregate(
        data,
        column="item",
        to="item_aggregated",
        groupby=["id"],
        operation=FieldAggregateOperation.Count,
    )
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
        data,
        column="item",
        to="item_aggregated",
        groupby=["id"],
        operation=FieldAggregateOperation.ArrayAggDistinct,
    )
    assert result["id"].to_list() == [1, 2, 3]
    assert result["item_aggregated"].to_list() == [["a", "b"], ["c", "d"], ["e"]]
    assert result.get("item") is None
