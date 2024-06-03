#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unfold verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import (
    Table,
    VerbResult,
    create_verb_result,
)
from datashaper.verbs import unfold


@verb(name="unfold")
def unfold_verb(input: VerbInput, **kwargs: Any) -> VerbResult:
    """Unfold verb implementation."""
    result = unfold(cast(pd.DataFrame, input.get_input()), **kwargs)
    return create_verb_result(cast(Table, result))
