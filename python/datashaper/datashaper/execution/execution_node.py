#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Contains the definition for the ExecutionNode type."""
from dataclasses import dataclass, field

from datashaper.engine.verbs.types import VerbDetails


@dataclass
class InputBinding:
    """A binding specification to an input node."""

    node: str
    """The input node id."""

    output: str | None = None
    """The output name to bind to. Default Output if None"""


"""A workflow input specification"""
WorkflowInput = InputBinding | str


@dataclass
class ExecutionNode:
    """A data processing node in the execution pipeline."""

    node_id: str
    """The unique identifier for this node."""

    has_explicit_id: bool
    """A flag to indicate whether the node has an explicit ID."""

    verb: VerbDetails
    """The verb to execute in this graph node."""

    node_input: str | dict[str, WorkflowInput | list[WorkflowInput]]
    """The input to this node."""

    args: dict = field(default_factory=dict)
    """The arguments to pass to the verb."""
