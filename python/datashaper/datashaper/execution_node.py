#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""The graph module contains the graph classes used by the datashaper."""
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional, Union

from datashaper.table_store import TableContainer


@dataclass
class ExecutionNode:
    """A data processing node in the execution pipeline."""

    node_id: str
    verb: Callable
    node_input: Union[str, Dict[str, List[str]]]
    args: Dict[str, Any] = field(default_factory=dict)
    result: Optional[TableContainer] = None