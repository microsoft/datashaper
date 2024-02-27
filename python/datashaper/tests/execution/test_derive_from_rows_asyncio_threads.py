import asyncio
from threading import Lock

import pandas as pd

from datashaper import NoopVerbCallbacks, derive_from_rows_asyncio_threads


async def test_derive_from_rows_asyncio_threads():
    """Test the derive_from_rows_asyncio_threads function."""

    table = pd.DataFrame({"x": range(100), "y": range(100)})

    num_concurrent = 0
    lock = Lock()

    async def strategy(series: pd.Series) -> int:
        nonlocal num_concurrent
        with lock:
            num_concurrent += 1
            if num_concurrent > 4:
                error = f"too many concurrent executions {num_concurrent}"
                raise ValueError(error)

        await asyncio.sleep(0.1)

        with lock:
            num_concurrent -= 1

        return series["x"] + series["y"]

    result = await derive_from_rows_asyncio_threads(
        table, strategy, NoopVerbCallbacks()
    )

    assert len(result) == 100
    for i, value in enumerate(result):
        assert value == i * 2
