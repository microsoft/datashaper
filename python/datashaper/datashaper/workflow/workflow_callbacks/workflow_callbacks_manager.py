"""A module containing the WorkflowCallbacks registry."""

from datashaper.execution.execution_node import ExecutionNode
from datashaper.progress import Progress
from datashaper.table_store.types import TableContainer

from .workflow_callbacks import WorkflowCallbacks


class WorkflowCallbacksManager(WorkflowCallbacks):
    """A registry of WorkflowCallbacks."""

    _callbacks: list[WorkflowCallbacks]

    def __init__(self):
        """Create a new instance of WorkflowCallbacksRegistry."""
        self._callbacks = []

    def register(self, callbacks: WorkflowCallbacks) -> None:
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

    def on_step_start(self, node: ExecutionNode, inputs: dict) -> None:
        """Execute this callback every time a step starts."""
        for callback in self._callbacks:
            if hasattr(callback, "on_step_start"):
                callback.on_step_start(node, inputs)

    def on_step_end(self, node: ExecutionNode, result: TableContainer | None) -> None:
        """Execute this callback every time a step ends."""
        for callback in self._callbacks:
            if hasattr(callback, "on_step_end"):
                callback.on_step_end(node, result)

    def on_step_progress(self, node: ExecutionNode, progress: Progress) -> None:
        """Handle when progress occurs."""
        for callback in self._callbacks:
            if hasattr(callback, "on_step_progress"):
                callback.on_step_progress(node, progress)

    def on_error(
        self,
        message: str,
        cause: BaseException | None = None,
        stack: str | None = None,
        details: dict | None = None,
    ) -> None:
        """Handle when an error occurs."""
        for callback in self._callbacks:
            if hasattr(callback, "on_error"):
                callback.on_error(message, cause, stack, details)

    def on_warning(self, message: str, details: dict | None = None) -> None:
        """Handle when a warning occurs."""
        for callback in self._callbacks:
            if hasattr(callback, "on_warning"):
                callback.on_warning(message, details)

    def on_log(self, message: str, details: dict | None = None) -> None:
        """Handle when a log message occurs."""
        for callback in self._callbacks:
            if hasattr(callback, "on_log"):
                callback.on_log(message, details)

    def on_measure(self, name: str, value: float, details: dict | None = None) -> None:
        """Handle when a measurement occurs."""
        for callback in self._callbacks:
            if hasattr(callback, "on_measure"):
                callback.on_measure(name, value, details)
