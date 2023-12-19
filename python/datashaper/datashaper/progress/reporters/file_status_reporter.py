import json
import os

from io import TextIOWrapper
from typing import Any

from datashaper.progress.reporters.console_status_reporter import print_warning
from datashaper.progress.reporters.status_reporter import StatusReporter
from datashaper.progress.types import ProgressStatus


class FileStatusReporter(StatusReporter):
    """A reporter that writes to a file."""

    _out_stream: TextIOWrapper

    def __init__(self, dir: str):
        os.makedirs(dir, exist_ok=True)
        self._out_stream = open(os.path.join(dir, "logs.json"), "w", encoding="utf-8")

    def progress(self, progress: ProgressStatus):
        pass

    def error(self, message: str, details: dict[str, Any] | None = None):
        self._out_stream.write(
            json.dumps({"type": "error", "data": message, "details": details}) + "\n"
        )
        print(message, details)

    def warning(self, message: str, details: dict[str, Any] | None = None):
        self._out_stream.write(
            json.dumps({"type": "warning", "data": message, "details": details}) + "\n"
        )
        print_warning(message)

    def log(self, message: str, details: dict[str, Any] | None = None):
        self._out_stream.write(
            json.dumps({"type": "log", "data": message, "details": details}) + "\n"
        )
        print(message, details)
