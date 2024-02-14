"""A module containing the derive_from_rows_async method."""
import asyncio
import traceback
from collections.abc import Awaitable, Callable
from typing import Any, TypeVar

import pandas as pd

from datashaper.errors import VerbParallelizationError
from datashaper.progress import progress_ticker
from datashaper.workflow.verb_callbacks.verb_callbacks import VerbCallbacks

ItemType = TypeVar("ItemType")

ExecuteFn = Callable[
    [tuple[Any, pd.Series], asyncio.Semaphore], Awaitable[ItemType | None]
]
GatherFn = Callable[[asyncio.Semaphore, ExecuteFn], Awaitable[list[ItemType | None]]]


async def derive_from_rows_base(
    input: pd.DataFrame,
    transform: Callable[[pd.Series], Awaitable[ItemType]],
    callbacks: VerbCallbacks,
    max_parallelism: int | None,
    gather: GatherFn[ItemType],
) -> list[ItemType | None]:
    """
    Derive from rows asynchronously.

    This is useful for IO bound operations.
    """
    max_parallelism = max_parallelism or 4
    tick = progress_ticker(callbacks.progress, num_total=len(input))
    errors: list[tuple[BaseException, str]] = []

    async def execute(
        row: tuple[Any, pd.Series], sem: asyncio.Semaphore
    ) -> ItemType | None:
        async with sem:
            try:
                return await transform(row[1])
            except Exception as e:
                traceback.print_exc()
                errors.append((e, traceback.format_exc()))
                return None
            finally:
                tick(1)

    result = await gather(asyncio.Semaphore(max_parallelism), execute)

    tick.done()

    for error, stack in errors:
        callbacks.error("parallel transformation error", error, stack)

    if len(errors) > 0:
        raise VerbParallelizationError(len(errors))

    return result
