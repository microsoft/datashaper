#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Select verb implementation."""
from typing import cast

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import (
    Table,
    VerbResult,
    create_verb_result,
)


@verb(name="select", treats_input_tables_as_immutable=True)
def select(
    input: VerbInput,
    columns: list[str],
    **_kwargs: dict,
) -> VerbResult:
    """Select verb implementation."""
    input_table = input.get_input()
    output = cast(Table, input_table[columns])
    return create_verb_result(output)
