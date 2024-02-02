"""A module containing the derive_from_rows_async method."""
import asyncio
import traceback

from typing import Any, Awaitable, Callable, TypeVar

import pandas as pd

from datashaper.progress import ProgressTicker, progress_ticker
from datashaper.workflow import VerbCallbacks


ItemType = TypeVar("ItemType")


async def derive_from_rows_async(
    input: pd.DataFrame,
    transform: Callable[[pd.Series], Awaitable[ItemType]],
    callbacks: VerbCallbacks,
    max_parallelism: int | None = 4,
) -> list[ItemType | None]:
    """
    Derive from rows asynchronously.

    This is useful for IO bound operations.
    """
    max_parallelism = max_parallelism or 4
    tick = progress_ticker(callbacks.progress, num_total=len(input))
    errors = []

    async def execute(
        row: tuple[Any, pd.Series], tick: ProgressTicker
    ) -> ItemType | None:
        try:
            output = await transform(row[1])
            tick(1)
            return output
        except Exception as e:
            traceback.print_exc()
            errors.append(e)
            return None

    async def execute_wrapper(row: tuple[Any, pd.Series], tick: ProgressTicker):
        return await asyncio.to_thread(execute, row, tick)

    async with asyncio.Semaphore(max_parallelism):
        result = await asyncio.gather(
            *[await execute_wrapper(row, tick) for row in input.iterrows()]
        )

    tick.done()

    for error in errors:
        callbacks.error("Received errors during parallel transformation", error)
    if len(errors) > 0:
        raise ValueError(
            "Errors occurred while running parallel transformation, could not complete!"
        )

    return result
