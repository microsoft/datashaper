"""Data-types for workflow runs."""
from dataclasses import dataclass


@dataclass
class VerbTiming:
    """The timing of a verb in a workflow run."""

    id: str
    index: int
    verb: str
    timing: float


@dataclass
class WorkflowRunResult:
    """The result of a workflow run."""

    verb_timings: list[VerbTiming]
