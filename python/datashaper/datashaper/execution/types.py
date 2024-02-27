"""Execution utility typings."""
from collections.abc import Callable

from datashaper.table_store.types import TableContainer

VerbDefinitions = dict[str, Callable[..., TableContainer]]
"""A mapping of verb names to their implementations."""
