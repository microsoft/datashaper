from typing import Any

from datashaper.progress.reporters.status_reporter import StatusReporter
from datashaper.progress.types import ProgressStatus


class NoopStatusReporter(StatusReporter):
    """A reporter that writes to a console."""

    def progress(self, progress: ProgressStatus):
        pass

    def error(self, message: str, details: dict[str, Any] | None = None):
        pass

    def warning(self, message: str, details: dict[str, Any] | None = None):
        pass

    def log(self, message: str, details: dict[str, Any] | None = None):
        pass
