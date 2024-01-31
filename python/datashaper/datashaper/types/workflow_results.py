"""Data-types for workflow runs."""
import pandas as pd

from dataclasses import dataclass, field


@dataclass
class VerbTiming:
    """The timing of a verb in a workflow run."""

    id: str
    index: int
    verb: str
    timing: float


@dataclass
class MemoryProfile:
    snapshot_stats: pd.DataFrame
    peak_stats: pd.DataFrame
    time_stats: pd.DataFrame
    detailed_view: pd.DataFrame


@dataclass
class WorkflowRunResult:
    """The result of a workflow run."""

    verb_timings: list[VerbTiming] = field(default_factory=list)

    memory_profile: MemoryProfile | None = None
