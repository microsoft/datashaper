#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Union verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.types import VerbResult
from datashaper.verbs import union


@verb(name="union", treats_input_tables_as_immutable=True)
def union_verb(input: VerbInput, **kwargs: Any) -> VerbResult:
    """Union verb implementation."""
    result = union(
        cast(pd.DataFrame, input.get_input()),
        cast(list[pd.DataFrame], input.get_others()),
        **kwargs,
    )
    return create_verb_result(result)
