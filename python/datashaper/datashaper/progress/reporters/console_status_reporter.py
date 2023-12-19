from typing import Any

from datashaper.progress.reporters.status_reporter import StatusReporter
from datashaper.progress.types import ProgressStatus


class ConsoleStatusReporter(StatusReporter):
    """A reporter that writes to a console."""

    def progress(self, progress: ProgressStatus):
        pass

    def error(self, message: str, details: dict[str, Any] | None = None):
        print(message, details)

    def warning(self, message: str, details: dict[str, Any] | None = None):
        print_warning(message)

    def log(self, message: str, details: dict[str, Any] | None = None):
        print(message, details)


def print_warning(skk):
    print("\033[93m {}\033[00m".format(skk))
