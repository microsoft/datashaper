#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Boolean verb implementation."""
from typing import cast

import pandas as pd

from datashaper.engine.pandas import boolean_function_map
from datashaper.engine.types import BooleanLogicalOperator
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result


@verb(name="boolean")
def boolean(
    input: VerbInput,
    to: str,
    columns: list[str],
    operator: str,
    **_kwargs: dict,
) -> VerbResult:
    """Boolean verb implementation."""
    logical_operator = BooleanLogicalOperator(operator)
    input_table = input.get_input()
    output = cast(pd.DataFrame, input_table)
    output[to] = boolean_function_map[logical_operator](output, columns)

    return create_verb_result(output)
