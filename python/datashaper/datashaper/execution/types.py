from typing import Callable

from datashaper.table_store import TableContainer


VerbDefinitions = dict[str, Callable[..., TableContainer]]
"""A mapping of verb names to their implementations."""
