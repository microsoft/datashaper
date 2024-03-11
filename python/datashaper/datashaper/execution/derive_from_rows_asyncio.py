"""A module containing the derive_from_rows_async method."""

import asyncio
from collections.abc import Awaitable, Callable, Hashable
from typing import TypeVar

import pandas as pd

from datashaper.workflow.verb_callbacks.verb_callbacks import VerbCallbacks

from .derive_from_rows_base import ExecuteFn, derive_from_rows_base

ItemType = TypeVar("ItemType")


async def derive_from_rows_asyncio(
    input: pd.DataFrame,
    transform: Callable[[pd.Series], Awaitable[ItemType]],
    callbacks: VerbCallbacks,
    num_threads: int = 4,
) -> list[ItemType | None]:
    """
    Derive from rows asynchronously.

    This is useful for IO bound operations.
    """
    semaphore = asyncio.Semaphore(num_threads or 4)

    async def gather(execute: ExecuteFn[ItemType]) -> list[ItemType | None]:
        async def execute_row_protected(
            row: tuple[Hashable, pd.Series],
        ) -> ItemType | None:
            async with semaphore:
                return await execute(row)

        tasks = [
            asyncio.create_task(execute_row_protected(row)) for row in input.iterrows()
        ]
        return await asyncio.gather(*tasks)

    return await derive_from_rows_base(input, transform, callbacks, gather)
