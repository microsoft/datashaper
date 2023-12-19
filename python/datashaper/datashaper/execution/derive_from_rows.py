from typing import Callable, TypeVar

import pandas as pd

from datashaper.execution.utils import transform_pandas_table
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
    results, errors = transform_pandas_table(
        input,
        callback,
        num_threads=num_threads,
        stagger=stagger,
    )

    if len(errors) > 0:
        reporter.error(
            "Received errors during parallel transformation",
            {"errors": [str(error or "") for error in errors]},
        )
        raise ValueError(
            "Errors occurred while running parallel transformation, could not complete!"
        )

    return results
