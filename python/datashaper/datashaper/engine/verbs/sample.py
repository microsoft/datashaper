#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Sample verb implementation."""

from typing import Any

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import (
    TableContainer,
    VerbResult,
    create_verb_result,
)
from datashaper.verbs import sample


@verb(name="sample", treats_input_tables_as_immutable=True)
def sample_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Sample verb implementation."""
    result, unsampled = sample(input.get_input(), **kwargs)
    return create_verb_result(result, {"remainder": TableContainer(unsampled)})
