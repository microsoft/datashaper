from abc import ABCMeta, abstractmethod
from typing import Any, Callable

from dataclasses import dataclass


@dataclass
class ProgressStatus:
    progress: float | None = None
    """0 - 1 progress"""

    description: str | None = None
    """Description of the progress"""

    total_items: int | None = None
    """Total number of items"""
    completed_items: int | None = None
    """Number of items completed"""


StatusReportHandler = Callable[[ProgressStatus], Any]
"""A progress reporter function."""


class StatusReporter(metaclass=ABCMeta):
    """Provides a way to report status updates from the pipeline."""

    @abstractmethod
    def progress(self, progress: ProgressStatus):
        pass

    @abstractmethod
    def error(self, message: str, details: dict[str, Any] | None = None):
        pass

    @abstractmethod
    def warning(self, message: str, details: dict[str, Any] | None = None):
        pass

    @abstractmethod
    def log(self, message: str, details: dict[str, Any] | None = None):
        pass
