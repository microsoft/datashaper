#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Sample verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.types import VerbResult
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import TableContainer
from datashaper.verbs import sample


@verb(name="sample", treats_input_tables_as_immutable=True)
def sample_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Sample verb implementation."""
    result, unsampled = sample(cast(pd.DataFrame, input.get_input()), **kwargs)
    others = {"remainder": TableContainer(unsampled)} if unsampled is not None else {}
    return create_verb_result(result, named_outputs=others)
