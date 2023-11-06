from typing import Iterable, TypeVar

from .progress_ticker import progress_ticker
from .types import ProgressStatus, StatusReportHandler

T = TypeVar("T")


def progress_iterable(
    iterable: Iterable[T],
    progress: StatusReportHandler | None,
    num_total: int | None = None,
) -> Iterable[T]:
    """Wrap an iterable with a progress handler. Every time an item is yielded, the progress handler will be called with the current progress."""

    if num_total is None:
        num_total = len(list(iterable))

    tick = progress_ticker(progress, num_total)

    for item in iterable:
        tick(1)
        yield item
