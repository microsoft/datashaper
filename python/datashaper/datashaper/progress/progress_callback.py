from typing import Any, Callable

from datashaper.progress.progress_ticker import ProgressTicker
from datashaper.progress.types import ProgressHandler


def progress_callback(
    callback: Callable[..., Any], progress: ProgressHandler | None, num_total: int
) -> Callable[..., Any]:
    """Wrap a callback with a progress handler. Every time the callback is called, the progress handler will be called with the current progress."""

    tick = ProgressTicker(progress, num_total)

    def wrapper(*args, **kwargs):
        result = callback(*args, **kwargs)
        tick(1)
        return result

    return wrapper
