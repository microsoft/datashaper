#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Upper verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="strings.upper")
def upper(input: VerbInput, column: str, to: str, **_kwargs: dict) -> VerbResult:
    """Upper verb implementation."""
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)
    output[to] = output[column].str.upper()
    return create_verb_result(output)
