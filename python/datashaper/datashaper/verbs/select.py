#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Select verb implementation."""

from typing import Any, cast

import pandas as pd

from datashaper.decorators import verb


@verb(name="select", treats_input_tables_as_immutable=True)
def select(table: pd.DataFrame, columns: list[str], **_kwargs: Any) -> pd.DataFrame:
    """Select verb implementation."""
    return cast(pd.DataFrame, table[columns])
