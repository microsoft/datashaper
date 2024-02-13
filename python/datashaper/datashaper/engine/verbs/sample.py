#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Sample verb implementation."""
from typing import cast

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import (
    Table,
    TableContainer,
    VerbResult,
    create_verb_result,
)


@verb(name="sample", treats_input_tables_as_immutable=True)
def sample(
    input: VerbInput,
    size: int | None = None,
    proportion: int | None = None,
    seed: int | None = None,
    emitRemainder: bool | None = False,  # noqa F403 - schema argument
) -> VerbResult:
    """Sample verb implementation."""
    input_table = input.get_input()
    if not emitRemainder:
        output = input_table.sample(n=size, frac=proportion, random_state=seed)
        return create_verb_result(cast(Table, output))

    result = input_table.sample(n=size, frac=proportion, random_state=seed)

    sampled_ids: list = [row[0] for row in result.iterrows()]
    non_sampled_ids: list = [
        row[0] for row in input_table.iterrows() if row[0] not in sampled_ids
    ]

    unsampled = input_table.loc[non_sampled_ids].reset_index(drop=True)

    return create_verb_result(
        cast(Table, result), named_outputs={"remainder": TableContainer(unsampled)}
    )
