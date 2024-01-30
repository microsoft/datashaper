#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

import numpy as np
import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


def _destructureSingleValue(
    row, object: object, isArray: bool, prefix: str, keys: List[str] = []
):
    index = 0

    for property, value in object.__dict__.items():
        if (keys == None or len(keys) == 0) or (keys != None and property in keys):
            if isArray:
                row[prefix + index] = object[property]
            else:
                row[property] = object[property]

            ++index

    return row


@verb(name="destructure")
def destructure(
    input: VerbInput,
    column: str,
    keys: List[str] = [],
    prefix: str = "array_",
    preserveSource: bool = False,
):
    input_table = input.get_input()
    output = input_table

    for index in output.index:
        if output[column][index] != None:
            print("TEST GAUDY PYTHON")
            print(isinstance(output[column][index], str))
            output.loc[index] = _destructureSingleValue(
                output.loc[index],
                output[column][index],
                type(output) is list,
                prefix,
                keys,
            )

    filteredList: list[str] = []

    for col in output.columns:
        if col != column:
            filteredList.append(col)

    if not preserveSource:
        output = output[filteredList]

    return TableContainer(table=output)
