"""Contains the DelegatingVerbCallback definition."""
from typing import Any

from ...progress.types import Progress
from ..workflow_callbacks.workflow_callbacks import WorkflowCallbacks
from .verb_callbacks import VerbCallbacks


class DelegatingVerbCallbacks(VerbCallbacks):
    """A wrapper that implements VerbCallbacks that delegates to the underlying WorkflowCallbacks."""

    _workflow_callbacks: WorkflowCallbacks

    def __init__(self, workflow_callbacks: WorkflowCallbacks):
        """Create a new instance of DelegatingVerbCallbacks."""
        self._workflow_callbacks = workflow_callbacks

    def progress(self, progress: Progress):
        """A call back handler for when progress occurs."""
        self._workflow_callbacks.on_step_progress(progress)

    def error(
        self,
        message: str,
        cause: Exception | None = None,
        stack: str | None = None,
        details: dict[str, Any] | None = None,
    ):
        """A call back handler for when an error occurs."""
        self._workflow_callbacks.on_error(message, cause, stack, details)

    def warning(self, message: str, details: dict[str, Any] | None = None):
        """A call back handler for when a warning occurs."""
        self._workflow_callbacks.on_warning(message, details)

    def log(self, message: str, details: dict[str, Any] | None = None):
        """A call back handler for when a log occurs."""
        self._workflow_callbacks.on_log(message, details)

    def measure(self, name: str, value: float, details: dict[str, Any] | None = None):
        """A call back handler for when a measurement occurs."""
        self._workflow_callbacks.on_measure(name, value, details)
