#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Unfold verb implementation."""
from typing import cast

import numpy as np
import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import (
    Table,
    VerbResult,
    create_verb_result,
)


@verb(name="unfold")
def unfold(
    input: VerbInput,
    key: str,
    value: str,
    **_kwargs: dict,
) -> VerbResult:
    """Unfold verb implementation."""
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)

    columns = len(output[key].unique())

    new_index = np.array(output.index)
    new_index = np.floor_divide(new_index, columns)

    output.index = new_index

    output_temp = output.pivot(columns=key, values=value)
    output.drop(columns=[key, value], axis=1, errors="ignore", inplace=True)
    output = pd.concat(
        [cast(pd.DataFrame, output.groupby(level=0).agg("first")), output_temp], axis=1
    )

    return create_verb_result(cast(Table, output))
