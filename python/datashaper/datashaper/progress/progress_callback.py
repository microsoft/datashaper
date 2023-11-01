from typing import Any, Callable

from .types import ProgressStatus, StatusReportHandler


def progress_callback(
    callback: Callable[..., Any], progress: StatusReportHandler, num_total: int, tag = "Progress"
) -> Callable[..., Any]:
    """Wrap a callback with a progress handler. Every time the callback is called, the progress handler will be called with the current progress."""
    num_complete = 0
    progress(
        ProgressStatus(
            total_items=num_total,
            completed_items=0,
        )
    )

    def wrapper(*args, **kwargs):
        nonlocal num_complete
        result = callback(*args, **kwargs)
        num_complete += 1
        print("", tag, num_complete, " out of ", num_total)
        progress(
            ProgressStatus(
                total_items=num_total,
                completed_items=num_complete,
            )
        )
        return result

    return wrapper
