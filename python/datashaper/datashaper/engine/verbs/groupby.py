#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Groupby verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import groupby


@verb(name="groupby", treats_input_tables_as_immutable=True)
def groupby_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Groupby verb implementation."""
    result = groupby(cast(pd.DataFrame, input.get_input()), **kwargs)
    return create_verb_result(result)
