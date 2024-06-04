"""Execution utility typings."""

from collections.abc import Callable
from enum import Enum

from datashaper.table_store.types import TableContainer

VerbDefinitions = dict[str, Callable[..., TableContainer]]
"""A mapping of verb names to their implementations."""


class AsyncType(str, Enum):
    """Enum for the type of async to use."""

    AsyncIO = "asyncio"
    Threaded = "threaded"
