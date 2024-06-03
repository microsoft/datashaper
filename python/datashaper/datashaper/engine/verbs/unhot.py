"""Unhot verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.verbs import unhot


@verb(name="unhot")
def unhot_verb(
    input: VerbInput,
    **kwargs: Any,
) -> VerbResult:
    """Unhot verb implementation."""
    result = unhot(cast(pd.DataFrame, input.get_input()), **kwargs)
    return create_verb_result(result)
