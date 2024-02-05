#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from typing import cast

import pandas as pd

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
    n = -1 if globalMatch else 1
    case = False if caseInsensitive else True
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)
    output[to] = output[column].str.replace(
        pat=pattern,
        repl=replacement,
        n=n,
        case=case,
        regex=True,
    )
    return TableContainer(table=output)
