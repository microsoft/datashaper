#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Sample verb implementation."""
from typing import cast

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import Table, TableContainer


@verb(name="sample", treats_input_tables_as_immutable=True)
def sample(
    input: VerbInput,
    size: int | None = None,
    proportion: int | None = None,
    seed: int | None = None,
):
    """Sample verb implementation."""
    input_table = input.get_input()
    output = input_table.sample(n=size, frac=proportion, random_state=seed)
    return TableContainer(table=cast(Table, output))
