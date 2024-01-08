#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="sample", does_not_mutate_input_tables=True)
def sample(
    input: VerbInput, size: int = None, proportion: int = None, seed: int = None
):
    input_table = input.get_input()
    output = input_table.sample(n=size, frac=proportion, random_state=seed)
    return TableContainer(table=output)
