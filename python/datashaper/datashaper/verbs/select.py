#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Select verb implementation."""

from typing import Any, cast

import pandas as pd

from .decorators import VerbInputSpec, verb


@verb(name="select", input=VerbInputSpec("table", immutable=True))
def select(table: pd.DataFrame, columns: list[str], **_kwargs: Any) -> pd.DataFrame:
    """Select verb implementation."""
    return cast(pd.DataFrame, table[columns])
