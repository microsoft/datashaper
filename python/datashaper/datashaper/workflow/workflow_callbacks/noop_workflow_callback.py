"""A no-op implementation of WorkflowCallbacks."""
from typing import Optional

from ...execution.execution_node import ExecutionNode
from ...progress import Progress
from .workflow_callbacks import WorkflowCallbacks


class NoopWorkflowCallbacks(WorkflowCallbacks):
    """A no-op implementation of WorkflowCallbacks."""

    def on_step_progress(self, node: ExecutionNode, progress: Progress):
        """A no-op implementation of on_step_progress."""
        pass

    def on_error(
        self,
        message: str,
        cause: Optional[Exception] = None,
        stack: Optional[str] = None,
        details: Optional[dict] = None,
    ):
        """A no-op implementation of on_error."""
        pass

    def on_warning(self, message: str, details: Optional[dict] = None):
        """A no-op implementation of on_warning."""
        pass

    def on_log(self, message: str, details: Optional[dict] = None):
        """A no-op implementation of on_log."""
        pass

    def on_measure(self, name: str, value: float, details: Optional[dict] = None):
        """A no-op implementation of on_measure."""
        pass
