"""A module containing the derive_from_rows_async method."""
import logging
import traceback
from collections.abc import Awaitable, Callable
from typing import Any, TypeVar

import pandas as pd

from datashaper.errors import VerbParallelizationError
from datashaper.progress import progress_ticker
from datashaper.workflow.verb_callbacks.verb_callbacks import VerbCallbacks

ItemType = TypeVar("ItemType")

ExecuteFn = Callable[[tuple[Any, pd.Series]], Awaitable[ItemType | None]]
GatherFn = Callable[[ExecuteFn], Awaitable[list[ItemType | None]]]


async def derive_from_rows_base(
    input: pd.DataFrame,
    transform: Callable[[pd.Series], Awaitable[ItemType]],
    callbacks: VerbCallbacks,
    gather: GatherFn[ItemType],
) -> list[ItemType | None]:
    """
    Derive from rows asynchronously.

    This is useful for IO bound operations.
    """
    tick = progress_ticker(callbacks.progress, num_total=len(input))
    errors: list[tuple[BaseException, str]] = []

    async def execute(row: tuple[Any, pd.Series]) -> ItemType | None:
        try:
            return await transform(row[1])
        except Exception as e:
            logging.exception("parallel transformation error")
            errors.append((e, traceback.format_exc()))
            return None
        finally:
            tick(1)

    result = await gather(execute)

    tick.done()

    for error, stack in errors:
        callbacks.error("parallel transformation error", error, stack)

    if len(errors) > 0:
        raise VerbParallelizationError(len(errors))

    return result
