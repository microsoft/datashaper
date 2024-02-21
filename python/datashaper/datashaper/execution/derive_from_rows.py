"""Apply a generic transform function to each row in a table."""
import logging
from collections.abc import Awaitable, Callable
from enum import Enum
from typing import TypeVar

import pandas as pd

from datashaper.workflow.verb_callbacks.verb_callbacks import VerbCallbacks

from .derive_from_rows_asyncio import derive_from_rows_asyncio
from .derive_from_rows_asyncio_threads import derive_from_rows_asyncio_threads

logger = logging.getLogger(__name__)
ItemType = TypeVar("ItemType")


class AsyncIOType(str, Enum):
    """Enum for the type of asyncio to use."""

    AsyncIO = "asyncio"
    AsyncIOThreads = "asyncio_threads"


async def derive_from_rows(
    input: pd.DataFrame,
    transform: Callable[[pd.Series], Awaitable[ItemType]],
    callbacks: VerbCallbacks,
    num_threads: int = 4,
    scheduling_type: AsyncIOType = AsyncIOType.AsyncIO,
) -> list[ItemType | None]:
    """Apply a generic transform function to each row. Any errors will be reported and thrown."""
    match scheduling_type:
        case AsyncIOType.AsyncIO:
            return await derive_from_rows_asyncio(
                input, transform, callbacks, num_threads
            )
        case AsyncIOType.AsyncIOThreads:
            return await derive_from_rows_asyncio_threads(
                input, transform, callbacks, num_threads
            )
        case _:
            msg = f"Unsupported scheduling type {scheduling_type}"
            raise ValueError(msg)
