from typing import Iterable, TypeVar

from ...progress import ProgressStatus, StatusReportHandler


T = TypeVar("T")


def progress_iterable(
    iterable: Iterable[T],
    progress: StatusReportHandler | None,
    num_total: int | None = None,
) -> Iterable[T]:
    """Wrap an iterable with a progress handler. Every time an item is yielded, the progress handler will be called with the current progress."""
    if num_total is None:
        num_total = len(list(iterable))

    num_complete = 0
    for item in iterable:
        num_complete += 1
        if progress is not None:
            progress(
                ProgressStatus(
                    progress=None,
                    total_items=num_total,
                    completed_items=num_complete,
                )
            )
        yield item
