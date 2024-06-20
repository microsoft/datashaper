#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Data-types for workflow runs."""

from dataclasses import dataclass, field

import pandas as pd

from datashaper.verbs.engine.types import VerbDetails


@dataclass
class VerbTiming:
    """The timing of a verb in a workflow run."""

    id: str
    """The ID of the verb."""

    index: int
    """The index of the verb."""

    verb: str
    """The name of the verb."""

    timing: float
    """The time taken to execute the verb."""


@dataclass
class MemoryProfile:
    """The memory profile of a workflow run."""

    snapshot_stats: pd.DataFrame
    """Snapshot statistics."""

    peak_stats: pd.DataFrame
    """Peak memory statistics."""

    time_stats: pd.DataFrame
    """Time statistics."""

    detailed_view: pd.DataFrame
    """Detailed view of memory usage."""


@dataclass
class WorkflowRunResult:
    """The result of a workflow run."""

    verb_timings: list[VerbTiming] = field(default_factory=list)
    """The timings of the verbs in the workflow."""

    memory_profile: MemoryProfile | None = None
    """The memory profile of the workflow run."""


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
