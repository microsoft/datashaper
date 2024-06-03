#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Erase verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.types import VerbResult
from datashaper.verbs import erase


@verb(name="erase")
def erase_verb(input: VerbInput, **kwargs: Any) -> VerbResult:
    """Erase verb implementation."""
    result = erase(cast(pd.DataFrame, input.get_input()), **kwargs)
    return create_verb_result(result)
