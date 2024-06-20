"""Progress reporting types."""
from collections.abc import Callable
from dataclasses import dataclass


@dataclass
class Progress:
    """A class representing the progress of a task."""

    percent: float | None = None
    """0 - 1 progress"""

    description: str | None = None
    """Description of the progress"""

    total_items: int | None = None
    """Total number of items"""

    completed_items: int | None = None
    """Number of items completed""" ""


ProgressHandler = Callable[[Progress], None]
"""A function to handle progress reports."""
