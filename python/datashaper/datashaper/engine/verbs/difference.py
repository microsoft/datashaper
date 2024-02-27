#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Difference verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import Table, VerbResult, create_verb_result


@verb(name="difference", treats_input_tables_as_immutable=True)
def difference(
    input: VerbInput,
    **_kwargs: dict,
) -> VerbResult:
    """Difference verb implementation."""
    input_table = input.get_input()
    others = cast(list[pd.DataFrame], input.get_others())
    others = pd.concat(others)

    output = input_table.merge(others, how="left", indicator=True)
    output = output[output["_merge"] == "left_only"]
    output = output.drop("_merge", axis=1)

    return create_verb_result(cast(Table, output))
