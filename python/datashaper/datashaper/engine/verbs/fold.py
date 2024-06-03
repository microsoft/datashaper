#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Fold verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.types import VerbResult
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.verbs import fold


@verb(name="fold")
def fold_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Fold verb implementation."""
    output = fold(cast(pd.DataFrame, input.get_input()), **kwargs)
    return create_verb_result(output)
