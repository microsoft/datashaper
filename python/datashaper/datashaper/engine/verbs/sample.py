#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Optional

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer


@verb(name="sample", treats_input_tables_as_immutable=True)
def sample(
    input: VerbInput,
    size: Optional[int] = None,
    proportion: Optional[int] = None,
    seed: Optional[int] = None,
):
    input_table = input.get_input()
    output = input_table.sample(n=size, frac=proportion, random_state=seed)
    return TableContainer(table=output)
