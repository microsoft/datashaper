#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import pandas as pd
import numpy as np

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="unfold")
def unfold(input: VerbInput, key: str, value: str):
    input_table = input.get_input()
    output = input_table

    columns = len(output[key].unique())

    new_index = np.array(output.index)
    new_index = np.floor_divide(new_index, columns)

    output.index = new_index

    output_temp = output.pivot(columns=key, values=value)
    output.drop(columns=[key, value], axis=1, errors='ignore', inplace=True)
    output = pd.concat(
        [output.groupby(level=0).agg("first"), output_temp], axis=1
    )

    return TableContainer(table=output)
