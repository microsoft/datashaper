import os
import shutil
import tempfile

from functools import lru_cache

import pandas as pd

from .table_store import TableStore
from .types import TableContainer


class DiskTableStore(TableStore):
    """A default table store implementation."""

    def __init__(
        self,
        maxsize: int = 128,
        persist: bool = False,
        verbose=False,
        path: str | None = None,
    ) -> None:
        """Initialize the disk cache table store."""
        self._path = path or tempfile.mkdtemp()
        self._persist = persist
        self._maxsize = maxsize
        self._verbose = verbose
        self._cache_get = self._get_caching_function()

    def __enter__(self) -> TableStore:
        """Enter the context manager."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Exit the context manager."""
        if not self._persist:
            self.clear()

    def add(self, name: str, table: TableContainer) -> None:
        """Add a table to the store."""
        if self._verbose:
            print(f"saving table {name} to disk")
        table.table.to_parquet(f"{self._path}/{name}.parquet")

    def _get_caching_function(self):
        @lru_cache(maxsize=self._maxsize)
        def get_table(name: str) -> TableContainer:
            if self._verbose:
                print(f"loading table {name} from disk")
            return TableContainer(pd.read_parquet(f"{self._path}/{name}.parquet"))

        return get_table

    def get(self, name: str) -> TableContainer:
        """Get a table from the store."""
        return self._cache_get(name)

    def remove(self, name: str) -> None:
        """Remove a table from the store."""
        os.remove(f"{self._path}/{name}.parquet")

    def list(self) -> list[str]:
        """List the tables in the store."""
        return [
            f.removesuffix(".parquet")
            for f in os.listdir(self._path)
            if os.path.isfile(os.path.join(self._path, f))
        ]

    def clear(self) -> None:
        """Clear the store."""
        shutil.rmtree(self._path)
