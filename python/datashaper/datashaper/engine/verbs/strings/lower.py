#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Lower verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="strings.lower")
def lower(input: VerbInput, column: str, to: str) -> TableContainer:
    """Transform a column by applying a string-lowercase."""
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)
    output[to] = output[column].str.lower()
    return TableContainer(table=output)
