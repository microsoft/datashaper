"""Progress iterable."""

from collections.abc import Iterable
from typing import TypeVar

from .progress_ticker import ProgressTicker
from .types import ProgressHandler

T = TypeVar("T")


def progress_iterable(
    iterable: Iterable[T],
    progress: ProgressHandler | None,
    num_total: int | None = None,
) -> Iterable[T]:
    """Wrap an iterable with a progress handler. Every time an item is yielded, the progress handler will be called with the current progress."""
    if num_total is None:
        num_total = len(list(iterable))

    tick = ProgressTicker(progress, num_total)

    for item in iterable:
        tick(1)
        yield item
