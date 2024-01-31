"""A module containing the derive_from_rows_async method."""
import asyncio
import traceback

from typing import Any, Awaitable, Callable, TypeVar

import pandas as pd

from datashaper.progress import StatusReporter, progress_ticker


ItemType = TypeVar("ItemType")


async def derive_from_rows_async(
    input: pd.DataFrame,
    transform: Callable[[pd.Series], Awaitable[ItemType]],
    reporter: StatusReporter,
    max_parallelism: int | None = 4,
) -> list[ItemType | None]:
    """
    Derive from rows asynchronously.

    This is useful for IO bound operations.
    """
    max_parallelism = max_parallelism or 4
    tick = progress_ticker(progress=reporter.progress, num_total=len(input))
    errors = []

    async def execute(
        row: tuple[Any, pd.Series], sem: asyncio.Semaphore
    ) -> ItemType | None:
        async with sem:
            try:
                output = await transform(row[1])
                tick(1)
                return output
            except Exception as e:
                traceback.print_exc()
                errors.append(e)
                return None

    sem = asyncio.Semaphore(max_parallelism)
    tasks = [asyncio.create_task(execute(row, sem)) for row in input.iterrows()]
    result = await asyncio.gather(*tasks)

    if len(errors) > 0:
        reporter.error(
            "Received errors during parallel transformation",
            {"errors": [str(error or "") for error in errors]},
        )
        raise ValueError(
            "Errors occurred while running parallel transformation, could not complete!"
        )

    return result
