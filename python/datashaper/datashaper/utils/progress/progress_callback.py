"""Wraps a callback with a progress handler. Every time the callback is called, the progress handler will be called with the current progress."""

from collections.abc import Callable
from typing import TypeVar

from .progress_ticker import ProgressTicker
from .types import ProgressHandler

T = TypeVar("T")


def progress_callback(
    callback: Callable[..., T], progress: ProgressHandler | None, num_total: int
) -> Callable[..., T]:
    """Wrap a callback with a progress handler. Every time the callback is called, the progress handler will be called with the current progress."""
    tick = ProgressTicker(progress, num_total)

    def wrapper(*args: dict, **kwargs: dict) -> T:
        result = callback(*args, **kwargs)
        tick(1)
        return result

    return wrapper
