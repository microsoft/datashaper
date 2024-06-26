"""Apply a generic transform function to each row in a table."""

import logging
from collections.abc import Awaitable, Callable
from typing import TypeVar

import pandas as pd

from datashaper.verbs.callbacks import VerbCallbacks

from .derive_from_rows_asyncio import derive_from_rows_asyncio
from .derive_from_rows_asyncio_threads import derive_from_rows_asyncio_threads
from .types import AsyncStrategy

logger = logging.getLogger(__name__)
ItemType = TypeVar("ItemType")


async def derive_from_rows(
    input: pd.DataFrame,
    transform: Callable[[pd.Series], Awaitable[ItemType]],
    callbacks: VerbCallbacks,
    num_threads: int = 4,
    scheduling_type: AsyncStrategy = AsyncStrategy.AsyncIO,
) -> list[ItemType | None]:
    """Apply a generic transform function to each row. Any errors will be reported and thrown."""
    match scheduling_type:
        case AsyncStrategy.AsyncIO:
            return await derive_from_rows_asyncio(
                input, transform, callbacks, num_threads
            )
        case AsyncStrategy.Threaded:
            return await derive_from_rows_asyncio_threads(
                input, transform, callbacks, num_threads
            )
        case _:
            msg = f"Unsupported scheduling type {scheduling_type}"
            raise ValueError(msg)
