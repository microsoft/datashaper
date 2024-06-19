"""Execution utility typings."""

from enum import Enum


class AsyncStrategy(str, Enum):
    """Enum for the type of async to use."""

    AsyncIO = "asyncio"
    Threaded = "threaded"
