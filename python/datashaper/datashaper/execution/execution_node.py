#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Contains the definition for the ExecutionNode type."""
from typing import Any, Callable, Optional, Union

from dataclasses import dataclass, field

from datashaper.table_store import TableContainer


@dataclass
class ExecutionNode:
    """A data processing node in the execution pipeline."""

    node_id: str
    verb: Callable
    node_input: Union[str, dict[str, list[str]]]
    args: dict[str, Any] = field(default_factory=dict)
    result: Optional[TableContainer] = None
