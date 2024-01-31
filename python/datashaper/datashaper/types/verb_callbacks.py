from typing import Any, Protocol

from datashaper.progress.types import Progress
from datashaper.types.workflow_callbacks import WorkflowCallbacks


class VerbCallbacks(Protocol):
    """Provides a way to report status updates from the pipeline."""

    def progress(self, progress: Progress):
        "Report a progress update from the verb execution"
        ...

    def error(self, message: str, details: dict[str, Any] | None = None):
        "Report a error from the verb execution."
        ...

    def warning(self, message: str, details: dict[str, Any] | None = None):
        "Report a warning from verb execution."
        ...

    def log(self, message: str, details: dict[str, Any] | None = None):
        "Report an informational message from the verb execution."
        ...

    def measure(self, name: str, value: float):
        "Report a telemetry measurement from the verb execution."
        ...


class DelegatingVerbCallbacks(VerbCallbacks):
    _workflow_callbacks: WorkflowCallbacks

    def __init__(self, workflow_callbacks: WorkflowCallbacks):
        self._workflow_callbacks = workflow_callbacks

    def progress(self, progress: Progress):
        self._workflow_callbacks.on_step_progress(progress)

    def error(self, message: str, cause: Exception | None = None, stack: str | None = None, details: dict[str, Any] | None = None):
        self._workflow_callbacks.on_error(message, cause, stack, details)

    def warning(self, message: str, details: dict[str, Any] | None = None):
        self._workflow_callbacks.on_warning(message, details)

    def log(self, message: str, details: dict[str, Any] | None = None):
        self._workflow_callbacks.on_log(message, details)

    def measure(self, name: str, value: float, details: dict[str, Any] | None = None):
        self._workflow_callbacks.on_measure(name, value, details)
