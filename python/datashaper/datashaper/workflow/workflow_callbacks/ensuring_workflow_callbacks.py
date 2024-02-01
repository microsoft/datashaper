"""A wrapper around WorkflowCallbacks that ensures that all methods are implemented."""
from typing import Any, Optional

from ...execution.execution_node import ExecutionNode
from ...progress.types import Progress
from ...table_store import TableContainer
from .workflow_callbacks import WorkflowCallbacks


class EnsuringWorkflowCallbacks(WorkflowCallbacks):
    """A wrapper around WorkflowCallbacks that ensures that all methods are implemented."""

    _delegate: WorkflowCallbacks

    def __init__(self, delegate: WorkflowCallbacks):
        """Create a new instance of EnsuringWorkflowCallbacks."""
        self._delegate = delegate

    def on_workflow_start(self) -> None:
        """Execute this callback when a workflow starts."""
        if hasattr(self._delegate, "on_workflow_start"):
            self._delegate.on_workflow_start()

    def on_workflow_end(self) -> None:
        """Execute this callback when a workflow ends."""
        if hasattr(self._delegate, "on_workflow_end"):
            self._delegate.on_workflow_end()

    def on_step_start(self, node: ExecutionNode, inputs: dict[str, Any]) -> None:
        """Execute this callback every time a step starts."""
        if hasattr(self._delegate, "on_step_start"):
            self._delegate.on_step_start(node, inputs)

    def on_step_end(
        self, node: ExecutionNode, result: Optional[TableContainer]
    ) -> None:
        """Execute this callback every time a step ends."""
        if hasattr(self._delegate, "on_step_end"):
            self._delegate.on_step_end(node, result)

    def on_step_progress(self, progress: Progress) -> None:
        """A call back handler for when progress occurs."""
        if hasattr(self._delegate, "on_step_progress"):
            self._delegate.on_step_progress(progress)

    def on_error(
        self,
        message: str,
        cause: Exception | None = None,
        stack: str | None = None,
        details: dict[str, Any] | None = None,
    ) -> None:
        """A call back handler for when an error occurs."""
        if hasattr(self._delegate, "on_error"):
            self._delegate.on_error(message, cause, stack, details)

    def on_warning(self, message: str, details: dict[str, Any] | None = None) -> None:
        """A call back handler for when a warning occurs."""
        if hasattr(self._delegate, "on_warning"):
            self._delegate.on_warning(message, details)

    def on_log(self, message: str, details: dict[str, Any] | None = None) -> None:
        """A call back handler for when a log message occurs."""
        if hasattr(self._delegate, "on_log"):
            self._delegate.on_log(message, details)

    def on_measure(
        self, name: str, value: float, details: dict[str, Any] | None = None
    ) -> None:
        """A call back handler for when a measurement occurs."""
        if hasattr(self._delegate, "on_measure"):
            self._delegate.on_measure(name, value, details)
