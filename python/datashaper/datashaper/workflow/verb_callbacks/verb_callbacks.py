"""Defines the interface for verb callbacks."""
from typing import Protocol

from ...progress.types import Progress


class VerbCallbacks(Protocol):
    """Provides a way to report status updates from the pipeline."""

    def progress(self, progress: Progress):
        """Report a progress update from the verb execution"."""
        ...

    def error(
        self,
        message: str,
        cause: BaseException | None = None,
        stack: str | None = None,
        details: dict | None = None,
    ) -> None:
        """Report a error from the verb execution."""
        ...

    def warning(self, message: str, details: dict | None = None):
        """Report a warning from verb execution."""
        ...

    def log(self, message: str, details: dict | None = None):
        """Report an informational message from the verb execution."""
        ...

    def measure(self, name: str, value: float):
        """Report a telemetry measurement from the verb execution."""
        ...
