#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Copy verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer

from .verb_input import VerbInput


@verb(name="copy")
def copy(
    input: VerbInput,
    to: str,
    column: str,
) -> TableContainer:
    """Copy verb implementation."""
    output = cast(pd.DataFrame, input.get_input())
    output[to] = output[column]

    return TableContainer(table=output)
