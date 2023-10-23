from typing import Callable

from ..table_store import TableContainer


VerbDefinitions = dict[str, Callable[..., TableContainer]]
"""A mapping of verb names to their implementations."""

VerbTiming = dict[str, float]
"""The timings of verbs by id."""
