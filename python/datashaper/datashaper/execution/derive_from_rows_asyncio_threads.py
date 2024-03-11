"""A module containing the derive_from_rows_async method."""

import asyncio
from collections.abc import Awaitable, Callable, Coroutine
from typing import TypeVar

import pandas as pd

from datashaper.workflow.verb_callbacks.verb_callbacks import VerbCallbacks

from .derive_from_rows_base import ExecuteFn, derive_from_rows_base

ItemType = TypeVar("ItemType")


async def derive_from_rows_asyncio_threads(
    input: pd.DataFrame,
    transform: Callable[[pd.Series], Awaitable[ItemType]],
    callbacks: VerbCallbacks,
    num_threads: int | None = 4,
) -> list[ItemType | None]:
    """
    Derive from rows asynchronously.

    This is useful for IO bound operations.
    """
    semaphore = asyncio.Semaphore(num_threads or 4)

    async def gather(execute: ExecuteFn[ItemType]) -> list[ItemType | None]:
        tasks = [asyncio.to_thread(execute, row) for row in input.iterrows()]

        async def execute_task(task: Coroutine) -> ItemType | None:
            async with semaphore:
                # fire off the thread
                thread = await task
                return await thread

        return await asyncio.gather(*[execute_task(task) for task in tasks])

    return await derive_from_rows_base(input, transform, callbacks, gather)
