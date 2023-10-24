import traceback
from typing import Any, Callable, Tuple, TypeVar

import pandas as pd

from .parallelize import parallelize

ItemType = TypeVar("ItemType")


# DT: I couldn't get swifter or pandarallel to work the way I wanted, so here we are
def transform_pandas_table(
    df: pd.DataFrame,
    func: Callable[[pd.Series], ItemType],
    num_threads: int | None = None,
    stagger: int | None = None,
) -> Tuple[list[ItemType], list[BaseException | None]]:
    """Apply a function to each row of a dataframe, in parallel."""

    def execute(row: Tuple[Any, pd.Series]) -> ItemType:
        try:
            return func(row[1])
        except Exception as e:
            print(f"Error in apply_parallel: {e}")
            traceback.print_exc()
            raise e

    return parallelize(df.iterrows(), execute, num_threads, stagger)
