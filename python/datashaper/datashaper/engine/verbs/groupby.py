#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from ...table_store import TableContainer
from .verb_input import VerbInput


def groupby(input: VerbInput, columns: List[str]):
    input_table = input.get_input()
    output = input_table.groupby(by=columns)
    return TableContainer(table=output)
