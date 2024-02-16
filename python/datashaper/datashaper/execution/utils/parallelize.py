"""Parallelize a function over an iterable."""
import logging
import time
from collections.abc import Callable, Iterable
from concurrent.futures import Future, ThreadPoolExecutor, wait
from multiprocessing import cpu_count
from typing import TypeVar

InType = TypeVar("InType")
OutType = TypeVar("OutType")

logger = logging.getLogger(__name__)


# Print iterations progress https://stackoverflow.com/a/34325723
def parallelize(
    iterable: Iterable[InType],
    func: Callable[[InType], OutType],
    num_threads: int | None = None,
    stagger: int | None = None,
    stop_on_error: bool = False,
) -> tuple[list[OutType], list[BaseException | None]]:
    """Apply a function to each row of a dataframe, in parallel."""
    if num_threads is None or num_threads == 0:
        num_threads = 2 * cpu_count()

    executor = ThreadPoolExecutor(max_workers=num_threads)

    def execute(item: InType) -> OutType:
        try:
            return func(item)
        except Exception:
            logger.exception("Error parallelizing")
            raise

    futures: list[Future] = []
    num_staggered = 0
    for item in iterable:
        if stagger is not None and num_staggered < num_threads:
            num_staggered += 1
            time.sleep(stagger)
        futures.append(executor.submit(execute, item))
    done, not_done = wait(
        futures, return_when="ALL_COMPLETED" if not stop_on_error else "FIRST_EXCEPTION"
    )
    return [future.result() for future in futures], [
        future.exception() for future in not_done
    ]
