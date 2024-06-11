"""A class that emits progress reports incrementally."""

from .types import Progress, ProgressHandler


class ProgressTicker:
    """A class that emits progress reports incrementally."""

    _callback: ProgressHandler | None
    _num_total: int
    _num_complete: int

    def __init__(self, callback: ProgressHandler | None, num_total: int):
        self._callback = callback
        self._num_total = num_total
        self._num_complete = 0

    def __call__(self, num_ticks: int = 1) -> None:
        """Emit progress."""
        self._num_complete += num_ticks
        if self._callback is not None:
            self._callback(
                Progress(
                    total_items=self._num_total, completed_items=self._num_complete
                )
            )

    def done(self) -> None:
        """Mark the progress as done."""
        if self._callback is not None:
            self._callback(
                Progress(total_items=self._num_total, completed_items=self._num_total)
            )


def progress_ticker(callback: ProgressHandler | None, num_total: int) -> ProgressTicker:
    """Create a progress ticker."""
    return ProgressTicker(callback, num_total)
