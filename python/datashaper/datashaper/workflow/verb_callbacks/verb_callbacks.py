from typing import Optional, Protocol

from ...progress.types import Progress


class VerbCallbacks(Protocol):
    """Provides a way to report status updates from the pipeline."""

    def progress(self, progress: Progress):
        "Report a progress update from the verb execution"
        ...

    def error(
        self,
        message: str,
        cause: Optional[BaseException] = None,
        stack: Optional[str] = None,
        details: Optional[dict] = None,
    ) -> None:
        "Report a error from the verb execution."
        ...

    def warning(self, message: str, details: Optional[dict] = None):
        "Report a warning from verb execution."
        ...

    def log(self, message: str, details: Optional[dict] = None):
        "Report an informational message from the verb execution."
        ...

    def measure(self, name: str, value: float):
        "Report a telemetry measurement from the verb execution."
        ...
