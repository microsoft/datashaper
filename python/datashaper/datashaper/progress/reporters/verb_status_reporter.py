from typing import Any

from ..types import ProgressStatus, StatusReportHandler
from .status_reporter import StatusReporter


class VerbStatusReporter(StatusReporter):
    _progress: StatusReportHandler
    _pipeline_status: StatusReporter
    _name: str

    def __init__(
        self, name: str, pipeline_status: StatusReporter, progress: StatusReportHandler
    ):
        self._name = name
        self._progress = progress
        self._pipeline_status = pipeline_status

    def progress(self, progress: ProgressStatus):
        self._progress(progress)

        description = progress.description
        if description is not None:
            description += f": {progress.description}"

        # Also report the progress to the pipeline status
        self._pipeline_status.progress(
            ProgressStatus(
                progress=progress.progress,
                description=f"({self._name}){description or ''}",
                total_items=progress.total_items,
                completed_items=progress.completed_items,
            )
        )

    def warning(self, message: str, details: dict[str, Any] | None = None):
        self._pipeline_status.warning(
            f"Warning running verb ({self._name}): {message}", details
        )

    def error(self, message: str, details: dict[str, Any] | None = None):
        self._pipeline_status.error(
            f"Error running verb ({self._name}): {message}", details
        )

    def log(self, message: str, details: dict[str, Any] | None = None):
        self._pipeline_status.log(f"({self._name}): {message}", details)
