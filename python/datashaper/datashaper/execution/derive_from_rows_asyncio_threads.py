"""A module containing the derive_from_rows_async method."""
import asyncio
from collections.abc import Awaitable, Callable
from typing import TypeVar

import pandas as pd

from datashaper.workflow.verb_callbacks.verb_callbacks import VerbCallbacks

from .derive_from_rows_base import ExecuteFn, derive_from_rows_base

ItemType = TypeVar("ItemType")


async def derive_from_rows_asyncio_threads(
    input: pd.DataFrame,
    transform: Callable[[pd.Series], Awaitable[ItemType]],
    callbacks: VerbCallbacks,
    max_parallelism: int | None = 4,
) -> list[ItemType | None]:
    """
    Derive from rows asynchronously.

    This is useful for IO bound operations.
    """

    async def gather(
        sem: asyncio.Semaphore, execute: ExecuteFn[ItemType]
    ) -> list[ItemType | None]:
        tasks = [await asyncio.to_thread(execute, row, sem) for row in input.iterrows()]
        return await asyncio.gather(*tasks)

    return await derive_from_rows_base(
        input, transform, callbacks, max_parallelism, gather
    )
