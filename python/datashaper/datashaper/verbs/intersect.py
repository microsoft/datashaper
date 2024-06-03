#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Intersect verb implementation."""

from typing import cast

import pandas as pd


def intersect(
    table: pd.DataFrame, others: list[pd.DataFrame], **_kwargs: dict
) -> pd.DataFrame:
    """Intersect verb implementation."""
    output = table.merge(pd.concat(others), how="left", indicator=True)
    output = output[output["_merge"] == "both"]
    return cast(pd.DataFrame, output.drop("_merge", axis=1).reset_index(drop=True))
