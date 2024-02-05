#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from typing import cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="strings.upper")
def upper(input: VerbInput, column: str, to: str):
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)
    output[to] = output[column].str.upper()
    return TableContainer(table=output)
