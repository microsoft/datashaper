from typing import Callable, TypeVar

import pandas as pd

from ..progress import StatusReportHandler, progress_callback
from ..table_store import Table
from .utils import transform_pandas_table


ItemType = TypeVar("ItemType")


def derive_from_rows(
    input: Table,
    reporter: StatusReportHandler,
    transform: Callable[[pd.Series], ItemType],
    num_threads: int = 4,
    stagger: int = 0,
) -> list[ItemType]:
    """Apply a generic transform function to each row. Any errors will be reported and thrown."""
    output = input.copy()
    total_rows = len(output)

    results, errors = transform_pandas_table(
        output,
        progress_callback(transform, reporter.progress, total_rows),
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
