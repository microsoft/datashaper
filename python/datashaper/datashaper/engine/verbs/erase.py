#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Union, cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="erase")
def erase(input: VerbInput, column: str, value: Union[str, int, float]):
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)

    output[column] = output[column].apply(
        lambda df_value: None if df_value == value else df_value
    )

    return TableContainer(table=output)
