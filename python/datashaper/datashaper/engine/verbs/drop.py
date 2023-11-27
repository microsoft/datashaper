#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from typing import List

import pandas as pd

from ...table_store import TableContainer
from .verb_input import VerbInput


def drop(
    input: VerbInput,
    columns: List[str],
):
    output = input.get_input()
    output = output.drop(columns=columns)

    return TableContainer(table=output)
