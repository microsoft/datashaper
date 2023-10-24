from typing import Any, Callable, TypeVar

import pandas as pd

from ..engine import VerbInput
from ..progress import StatusReportHandler
from ..table_store import TableContainer
from .utils import transform_pandas_table, with_progress

ItemType = TypeVar("ItemType")


def apply_parallel_transform(
    input: VerbInput,
    reporter: StatusReportHandler,
    transform: Callable[[pd.Series], ItemType],
    num_threads: int = 4,
    stagger: int = 0,
) -> list[ItemType]:
    """Generate entities for each row, and optionally a graph of those entities."""
    output = input.get_input().copy()
    total_rows = len(output)

    results, errors = transform_pandas_table(
        output,
        with_progress(transform, reporter.progress, total_rows),
        num_threads=num_threads,
        stagger=stagger,
    )

    if len(errors) > 0:
        reporter.error(
            "Received errors during entity extraction",
            {"errors": [str(error or "") for error in errors]},
        )
        raise ValueError(
            "Errors occurred while running entity extraction, could not complete!"
        )

    return results
