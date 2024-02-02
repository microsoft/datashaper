"""A no-op implementation of WorkflowCallbacks."""
from typing import Any, Optional

from ...execution.execution_node import ExecutionNode
from ...progress import Progress
from ...table_store import TableContainer
from .workflow_callbacks import WorkflowCallbacks


class NoopWorkflowCallbacks(WorkflowCallbacks):
    """A no-op implementation of WorkflowCallbacks."""

    def on_workflow_start(self, name: str, instance: object) -> None:
        """Execute this callback when a workflow starts."""
        pass

    def on_workflow_end(self, name: str, instance: object) -> None:
        """Execute this callback when a workflow ends."""
        pass

    def on_step_start(self, node: ExecutionNode, inputs: dict[str, Any]) -> None:
        """Execute this callback every time a step starts."""
        pass

    def on_step_end(
        self, node: ExecutionNode, result: Optional[TableContainer]
    ) -> None:
        """Execute this callback every time a step ends."""
        pass

    def on_step_progress(self, node: ExecutionNode, progress: Progress) -> None:
        """A call back handler for when progress occurs."""
        pass

    def on_error(
        self,
        message: str,
        cause: Optional[BaseException] = None,
        stack: Optional[str] = None,
        details: Optional[dict] = None,
    ) -> None:
        """A call back handler for when an error occurs."""
        pass

    def on_warning(self, message: str, details: Optional[dict] = None) -> None:
        """A call back handler for when a warning occurs."""
        pass

    def on_log(self, message: str, details: Optional[dict] = None) -> None:
        """A call back handler for when a log message occurs."""
        pass

    def on_measure(
        self, name: str, value: float, details: Optional[dict] = None
    ) -> None:
        """A call back handler for when a measurement occurs."""
        pass
