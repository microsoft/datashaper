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
