#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Select verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.types import VerbResult
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.verbs import select


@verb(name="select", treats_input_tables_as_immutable=True)
def select_verb(input: VerbInput, columns: list[str], **kwargs: Any) -> VerbResult:
    """Select verb implementation."""
    result = select(cast(pd.DataFrame, input.get_input()), columns, **kwargs)
    return create_verb_result(result)
