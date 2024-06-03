#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Drop verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.types import VerbResult
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.verbs import drop

from .verb_input import VerbInput


@verb(name="drop")
def drop_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Drop verb implementation."""
    result = drop(cast(pd.DataFrame, input.get_input()), **kwargs)
    return create_verb_result(result)
