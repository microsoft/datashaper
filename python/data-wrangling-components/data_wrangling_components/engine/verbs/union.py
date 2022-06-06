#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from data_wrangling_components.engine.verbs.verb_input import VerbInput

import pandas as pd

from data_wrangling_components.table_store import TableContainer


def union(input: VerbInput):
    input_table = input.get_input()
    others = input.get_others()
    output = pd.concat([input_table] + others, ignore_index=True).drop_duplicates()

    return TableContainer(table=output)
