#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Dict

from data_wrangling_components.engine.verbs.verb_input import VerbInput
from data_wrangling_components.table_store import TableContainer


def rename(input: VerbInput, columns: Dict[str, str]):
    input_table = input.get_input()
    output = input_table.rename(columns=columns)
    return TableContainer(table=output)
