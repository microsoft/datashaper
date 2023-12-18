#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict, List

from datashaper.engine.verbs.verbs_mapping import verb

from ...table_store import TableContainer
from ..types import OrderByInstruction, SortDirection
from .verb_input import VerbInput


@verb(name="orderby")
def orderby(input: VerbInput, orders: List[Dict]):
    orders_instructions = [
        OrderByInstruction(
            column=order["column"], direction=SortDirection(order["direction"])
        )
        for order in orders
    ]
    input_table = input.get_input()

    columns = [order.column for order in orders_instructions]
    ascending = [
        order.direction == SortDirection.Ascending for order in orders_instructions
    ]

    output = input_table.sort_values(by=columns, ascending=ascending)
    return TableContainer(table=output)
