"""Data-types for workflow options and inputs."""

from dataclasses import dataclass


@dataclass
class WorkflowOptions:
    """Options for running a workflow."""

    memory_profile: bool | None = None
    """Memory profiling."""
