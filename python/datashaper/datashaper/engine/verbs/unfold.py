#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="unfold")
def unfold(input: VerbInput, key: str, value: str):
    input_table = input.get_input()
    output = input_table.copy()

    columns = len(output[key].unique())

    new_index = [index // columns for index in list(output.index)]

    output.index = new_index

    output_temp = output.pivot(columns=key, values=value)
    other_columns = [column for column in output.columns if column not in [key, value]]
    output = pd.concat(
        [output[other_columns].groupby(level=0).agg("first"), output_temp], axis=1
    )

    return TableContainer(table=output)
