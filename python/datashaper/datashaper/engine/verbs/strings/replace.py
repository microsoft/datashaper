#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Replace verb implementation."""
import re
from typing import cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="strings.replace")
def replace(
    input: VerbInput,
    column: str,
    to: str,
    pattern: str,
    replacement: str,
    globalMatch: bool = False,  # noqa: N803
    caseInsensitive: bool = False,  # noqa: N803
    **_kwargs: dict,
) -> VerbResult:
    """Replace verb implementation."""
    n = 0 if globalMatch else 1
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)
    pat = re.compile(pattern, flags=re.IGNORECASE if caseInsensitive else 0)
    output[to] = output[column].apply(lambda x: pat.sub(replacement, x, count=n))

    return create_verb_result(output)
