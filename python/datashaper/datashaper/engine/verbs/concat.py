#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import pandas as pd

from ...table_store import TableContainer
from .verb_input import VerbInput


def concat(input: VerbInput):
    input_table = input.get_input()
    others = input.get_others()
    output = pd.concat([input_table] + others, ignore_index=True)
    return TableContainer(table=output)
