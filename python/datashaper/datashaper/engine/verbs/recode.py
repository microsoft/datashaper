#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Recode verb implementation."""
from typing import Any, cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


class RecodeMap(dict):
    """Recode map class."""

    def __missing__(self, key: str):
        """Return the key if it is not found in the mapping."""
        return key


@verb(name="recode")
def recode(
    input: VerbInput,
    to: str,
    column: str,
    mapping: dict,
    **_kwargs: dict,
) -> VerbResult:
    """Recode verb implementation."""
    mapping = RecodeMap(mapping)

    input_table = input.get_input()

    output = cast(pd.DataFrame, input_table)
    output[to] = output[column].map(cast(Any, mapping))
    return create_verb_result(output)
