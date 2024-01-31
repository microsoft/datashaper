"""Data-types for workflow options and inputs."""

from dataclasses import dataclass


@dataclass
class WorkflowOptions:
    verbose: bool | None = None
    """Verbose output."""

    memory_profile: bool | None = None
    """Memory profiling."""
