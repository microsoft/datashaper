import traceback

from typing import Any, Callable, TypeVar

import pandas as pd

from datashaper.execution.utils.parallelize import parallelize
from datashaper.progress import progress_ticker
from datashaper.table_store import Table
from datashaper.workflow.verb_callbacks import VerbCallbacks


ItemType = TypeVar("ItemType")


def derive_from_rows(
    input: Table,
    transform: Callable[[pd.Series], ItemType],
    callbacks: VerbCallbacks,
    num_threads: int = 4,
    stagger: int = 0,
) -> list[ItemType]:
    """Apply a generic transform function to each row. Any errors will be reported and thrown."""

    tick = progress_ticker(callbacks.progress, num_total=len(input))

    def transform_row(row: tuple[Any, pd.Series]) -> ItemType:
        try:
            return transform(row[1])
        except Exception as e:
            print(f"Error in transform_pandas_table: {e}")
            traceback.print_exc()
            raise e
        finally:
            tick(1)

    results, errors = parallelize(input.iterrows(), transform_row, num_threads, stagger)
    tick.done()

    for error in errors:
        callbacks.error("Received errors during parallel transformation", error)

    if len(errors) > 0:
        raise ValueError(
            "Errors occurred while running parallel transformation, could not complete!"
        )

    return results
