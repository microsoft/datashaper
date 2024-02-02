"""A module containing the WorkflowCallbacks registry."""
from typing import Any, Optional

from ...execution.execution_node import ExecutionNode
from ...progress import Progress
from ...table_store import TableContainer
from .workflow_callbacks import WorkflowCallbacks


class WorkflowCallbacksManager(WorkflowCallbacks):
    """A registry of WorkflowCallbacks."""

    _callbacks: list[WorkflowCallbacks]

    def __init__(self):
        """Create a new instance of WorkflowCallbacksRegistry."""
        self._callbacks = []

    def register(self, callbacks: WorkflowCallbacks):
        """Register a new WorkflowCallbacks type."""
        self._callbacks.append(callbacks)

    def on_workflow_start(self, name: str, instance: object) -> None:
        """Execute this callback when a workflow starts."""
        for callback in self._callbacks:
            if hasattr(callback, "on_workflow_start"):
                callback.on_workflow_start(name, instance)

    def on_workflow_end(self, name: str, instance: object) -> None:
        """Execute this callback when a workflow ends."""
        for callback in self._callbacks:
            if hasattr(callback, "on_workflow_end"):
                callback.on_workflow_end(name, instance)

    def on_step_start(self, node: ExecutionNode, inputs: dict[str, Any]) -> None:
        """Execute this callback every time a step starts."""
        for callback in self._callbacks:
            if hasattr(callback, "on_step_start"):
                callback.on_step_start(node, inputs)

    def on_step_end(
        self, node: ExecutionNode, result: Optional[TableContainer]
    ) -> None:
        """Execute this callback every time a step ends."""
        for callback in self._callbacks:
            if hasattr(callback, "on_step_end"):
                callback.on_step_end(node, result)

    def on_step_progress(self, node: ExecutionNode, progress: Progress) -> None:
        """A call back handler for when progress occurs."""
        for callback in self._callbacks:
            if hasattr(callback, "on_step_progress"):
                callback.on_step_progress(node, progress)

    def on_error(
        self,
        message: str,
        cause: Optional[BaseException] = None,
        stack: Optional[str] = None,
        details: Optional[dict] = None,
    ) -> None:
        """A call back handler for when an error occurs."""
        for callback in self._callbacks:
            if hasattr(callback, "on_error"):
                callback.on_error(message, cause, stack, details)

    def on_warning(self, message: str, details: Optional[dict] = None) -> None:
        """A call back handler for when a warning occurs."""
        for callback in self._callbacks:
            if hasattr(callback, "on_warning"):
                callback.on_warning(message, details)

    def on_log(self, message: str, details: Optional[dict] = None) -> None:
        """A call back handler for when a log message occurs."""
        for callback in self._callbacks:
            if hasattr(callback, "on_log"):
                callback.on_log(message, details)

    def on_measure(
        self, name: str, value: float, details: Optional[dict] = None
    ) -> None:
        """A call back handler for when a measurement occurs."""
        for callback in self._callbacks:
            if hasattr(callback, "on_measure"):
                callback.on_measure(name, value, details)
