#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Impute verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.types import VerbResult
from datashaper.verbs import impute


@verb(name="impute")
def impute_verb(input: VerbInput, **kwargs: Any) -> VerbResult:
    """Impute verb implementation."""
    result = impute(cast(pd.DataFrame, input.get_input()), **kwargs)
    return create_verb_result(result)
