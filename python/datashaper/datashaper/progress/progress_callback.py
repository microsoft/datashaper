from typing import Any, Callable

from .progress_ticker import progress_ticker
from .types import StatusReportHandler


def progress_callback(
    callback: Callable[..., Any], progress: StatusReportHandler | None, num_total: int
) -> Callable[..., Any]:
    """Wrap a callback with a progress handler. Every time the callback is called, the progress handler will be called with the current progress."""

    tick = progress_ticker(progress, num_total)

    def wrapper(*args, **kwargs):
        result = callback(*args, **kwargs)
        tick(1)
        return result

    return wrapper
