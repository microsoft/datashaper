#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from typing import cast

import pandas as pd
import re

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="strings.replace")
def replace(
    input: VerbInput,
    column: str,
    to: str,
    pattern: str,
    replacement: str,
    globalMatch=False,
    caseInsensitive=False,
):
    n = 0 if globalMatch else 1
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)
    pat = re.compile(pattern, flags=re.IGNORECASE if caseInsensitive else 0)
    output[to] = output[column].apply(
        lambda x: pat.sub(replacement, x, count=n)
    )

    return TableContainer(table=output)
