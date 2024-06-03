#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unroll verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.types import VerbResult
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.verbs import unroll


@verb(name="unroll", treats_input_tables_as_immutable=True)
def unroll_verb(input: VerbInput, **kwargs: Any) -> VerbResult:
    """Unroll a column."""
    result = unroll(cast(pd.DataFrame, input.get_input()), **kwargs)
    return create_verb_result(result)
