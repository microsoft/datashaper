import traceback

from typing import Any, Callable, TypeVar

import pandas as pd

from datashaper.execution.utils.parallelize import parallelize
from datashaper.progress import progress_callback
from datashaper.progress.reporters.status_reporter import StatusReporter
from datashaper.table_store import Table


ItemType = TypeVar("ItemType")


def derive_from_rows(
    input: Table,
    transform: Callable[[pd.Series], ItemType],
    reporter: StatusReporter,
    num_threads: int = 4,
    stagger: int = 0,
) -> list[ItemType]:
    """Apply a generic transform function to each row. Any errors will be reported and thrown."""
    callback = progress_callback(
        callback=transform, progress=reporter.progress, num_total=len(input)
    )

    def transform_row(row: tuple[Any, pd.Series]) -> ItemType:
        try:
            return callback(row[1])
        except Exception as e:
            print(f"Error in transform_pandas_table: {e}")
            traceback.print_exc()
            raise e

    results, errors = parallelize(input.iterrows(), transform_row, num_threads, stagger)

    if len(errors) > 0:
        reporter.error(
            "Received errors during parallel transformation",
            {"errors": [str(error or "") for error in errors]},
        )
        raise ValueError(
            "Errors occurred while running parallel transformation, could not complete!"
        )

    return results
