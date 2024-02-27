#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Orderby verb implementation."""
from datashaper.engine.types import OrderByInstruction, SortDirection
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="orderby", treats_input_tables_as_immutable=True)
def orderby(
    input: VerbInput,
    orders: list[dict],
    **_kwargs: dict,
) -> VerbResult:
    """Orderby verb implementation."""
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
    return create_verb_result(output)
