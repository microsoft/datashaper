#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Orderby verb implementation."""

from typing import Any

import pandas as pd

from datashaper.verbs.types import OrderByInstruction, SortDirection


def orderby(table: pd.DataFrame, orders: list[dict], **_kwargs: Any) -> pd.DataFrame:
    """Orderby verb implementation."""
    orders_instructions = [
        OrderByInstruction(
            column=order["column"], direction=SortDirection(order["direction"])
        )
        for order in orders
    ]

    columns = [order.column for order in orders_instructions]
    ascending = [
        order.direction == SortDirection.Ascending for order in orders_instructions
    ]
    return table.sort_values(by=columns, ascending=ascending)
