#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Sample verb implementation."""

from typing import Any, cast

import pandas as pd

from .decorators import OutputMode, inputs, outputs, verb


@verb(
    name="sample",
    immutable_input=True,
    adapters=[
        inputs(default_input_argname="table"),
        outputs(
            mode=OutputMode.Tuple,
            output_names=["remainder"],
        ),
    ],
)
def sample(
    table: pd.DataFrame,
    size: int | None = None,
    proportion: int | None = None,
    seed: int | None = None,
    emitRemainder: bool | None = False,  # noqa F403 - schema argument
    **_kwargs: Any,
) -> tuple[pd.DataFrame, pd.DataFrame | None]:
    """Sample verb implementation."""
    result = table.sample(n=size, frac=proportion, random_state=seed)

    if not emitRemainder:
        return result, None

    unsampled = cast(pd.DataFrame, table[~table.index.isin(result.index)])
    return result, unsampled
