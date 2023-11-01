from typing import Callable, TypeVar

import pandas as pd

from ..progress import StatusReporter, progress_callback
from ..table_store import Table
from .utils import transform_pandas_table

ItemType = TypeVar("ItemType")


def derive_from_rows(
    input: Table,
    transform: Callable[[pd.Series], ItemType],
    reporter: StatusReporter | None = None,
    tag: str = 'derive_from_rows',
    num_threads: int = 4,
    stagger: int = 0,
) -> list[ItemType]:
    """Apply a generic transform function to each row. Any errors will be reported and thrown."""
    callback = (
        progress_callback(progress=transform, progress=reporter.progress, num_total=len(input), tag=tag)
        if reporter is not None
        else transform
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
