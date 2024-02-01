"""Data-types for workflow runs."""
import pandas as pd

from dataclasses import dataclass, field


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
class WorkflowOptions:
    """Options for running a workflow."""

    memory_profile: bool | None = None
    """Memory profiling."""
