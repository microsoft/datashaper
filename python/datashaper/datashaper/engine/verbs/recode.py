#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from typing import Any, cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


class RecodeMap(dict):
    def __missing__(self, key):
        return key


@verb(name="recode")
def recode(input: VerbInput, to: str, column: str, mapping: dict):
    mapping = RecodeMap(mapping)

    input_table = input.get_input()

    output = cast(pd.DataFrame, input_table)
    output[to] = output[column].map(cast(Any, mapping))
    return TableContainer(table=output)
