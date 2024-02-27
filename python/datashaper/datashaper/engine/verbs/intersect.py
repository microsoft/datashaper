#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Intersect verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import (
    Table,
    VerbResult,
    create_verb_result,
)


@verb(name="intersect", treats_input_tables_as_immutable=True)
def intersect(input: VerbInput, **_kwargs: dict) -> VerbResult:
    """Intersect verb implementation."""
    input_table = input.get_input()
    others = cast(list[pd.DataFrame], input.get_others())
    others = pd.concat(others)

    output = input_table.merge(others, how="left", indicator=True)
    output = output[output["_merge"] == "both"]
    output = output.drop("_merge", axis=1).reset_index(drop=True)

    return create_verb_result(cast(Table, output))
