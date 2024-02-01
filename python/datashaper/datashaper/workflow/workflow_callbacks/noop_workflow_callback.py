"""A no-op implementation of WorkflowCallbacks."""
from .workflow_callbacks import WorkflowCallbacks


class NoopWorkflowCallbacks(WorkflowCallbacks):
    """A no-op implementation of WorkflowCallbacks."""

    def on_step_progress(self, node, progress):
        """A no-op implementation of on_step_progress."""
        pass

    def on_error(self, message, cause, stack, details):
        """A no-op implementation of on_error."""
        pass

    def on_warning(self, message, details):
        """A no-op implementation of on_warning."""
        pass

    def on_log(self, message, details):
        """A no-op implementation of on_log."""
        pass

    def on_measure(self, name, value, details):
        """A no-op implementation of on_measure."""
        pass
