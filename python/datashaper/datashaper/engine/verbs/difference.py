#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Difference verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import difference


@verb(name="difference", treats_input_tables_as_immutable=True)
def difference_verb(input: VerbInput, **kwargs: Any) -> VerbResult:
    """Difference verb implementation."""
    result = difference(
        cast(pd.DataFrame, input.get_input()),
        cast(list[pd.DataFrame], input.get_others()),
        **kwargs,
    )
    return create_verb_result(result)
