#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Sample verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.constants import DEFAULT_OUTPUT_NAME

from .decorators import VerbInputSpec, verb


@verb(
    name="sample",
    input=VerbInputSpec("table", immutable=True),
)
def sample(
    table: pd.DataFrame,
    size: int | None = None,
    proportion: int | None = None,
    seed: int | None = None,
    emitRemainder: bool | None = False,  # noqa F403 - schema argument
    **_kwargs: Any,
) -> dict[str, pd.DataFrame]:
    """Sample verb implementation."""
    result = table.sample(n=size, frac=proportion, random_state=seed)

    if not emitRemainder:
        return {DEFAULT_OUTPUT_NAME: result}

    unsampled = cast(pd.DataFrame, table[~table.index.isin(result.index)])
    return {DEFAULT_OUTPUT_NAME: result, "remainder": unsampled}
