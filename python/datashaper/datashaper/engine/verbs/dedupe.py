#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Dedupe verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.types import VerbResult
from datashaper.verbs import dedupe


@verb(name="dedupe", treats_input_tables_as_immutable=True)
def dedupe_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Dedupe verb implementation."""
    result = dedupe(cast(pd.DataFrame, input.get_input()), **kwargs)
    return create_verb_result(result)
