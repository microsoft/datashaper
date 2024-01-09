#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import pandas as pd
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="concat", treats_input_tables_as_immutable=True)
def concat(input: VerbInput):
    input_table = input.get_input()
    others = input.get_others()
    output = pd.concat([input_table] + others, ignore_index=True)
    return TableContainer(table=output)
