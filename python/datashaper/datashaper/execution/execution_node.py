#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Contains the definition for the ExecutionNode type."""
from typing import Any, Optional, Union

from dataclasses import dataclass, field

from datashaper.engine.verbs import VerbDetails
from datashaper.table_store import TableContainer


@dataclass
class ExecutionNode:
    """A data processing node in the execution pipeline."""

    node_id: str
    """The unique identifier for this node."""

    has_explicit_id: bool
    """A flag to indicate whether the node has an explicit ID."""

    verb: VerbDetails
    """The verb to execute in this graph node."""

    node_input: Union[str, dict[str, list[str]]]
    """The input to this node."""

    args: dict[str, Any] = field(default_factory=dict)
    """The arguments to pass to the verb."""

    result: Optional[TableContainer] = None
    """The result of executing this node."""
