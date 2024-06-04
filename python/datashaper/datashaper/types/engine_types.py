#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Common types used across the datashaper engine."""

from dataclasses import dataclass, field


@dataclass
class Step:
    """A workflow processing step."""

    verb: str
    input: str | dict[str, str]
    output: str | dict[str, str]
    args: dict = field(default_factory=dict)
