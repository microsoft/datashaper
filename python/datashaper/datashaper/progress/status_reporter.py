from abc import ABCMeta, abstractmethod
from typing import Any

from .types import ProgressStatus


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
