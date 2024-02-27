"""Data-types for workflow runs."""
from dataclasses import dataclass, field

import pandas as pd


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
