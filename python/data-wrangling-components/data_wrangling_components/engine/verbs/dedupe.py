#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from data_wrangling_components.engine.verbs.verb_input import VerbInput
from data_wrangling_components.table_store import TableContainer


def dedupe(input: VerbInput, columns: List[str] = None):
    input_table = input.get_input()
    output = input_table.drop_duplicates(columns)
    return TableContainer(table=output)
