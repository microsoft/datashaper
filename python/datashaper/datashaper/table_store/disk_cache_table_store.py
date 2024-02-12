#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""A table store for storing and retrieving tables using diskcache."""
import shutil
from io import BytesIO
from typing import cast
from uuid import uuid4

import diskcache as dc
import pandas as pd

from datashaper.table_store.table_store import TableStore
from datashaper.table_store.types import TableContainer


class DiskCacheTableStore(TableStore):
    """A table store for storing and retrieving tables."""

    def __init__(
        self, table_store_name: str | None = None, persist: bool = False
    ) -> None:
        """Initialize the default table store."""
        if table_store_name is None:
            table_store_name = str(uuid4())
        self._tables: dc.Cache = dc.Cache(table_store_name)
        self._keys: dict[str, str] = {}
        self._persist = persist

    def __enter__(self):
        """Enter the context manager."""
        return self

    def __exit__(self, exc_type, exc_value, traceback):  # noqa: ANN001
        """Exit the context manager."""
        if not self._persist:
            self.dispose()
        return self

    def add(self, name: str, table: TableContainer, tag: str = "default") -> None:
        """Add a table to the store."""
        self._keys[name] = tag
        data = cast(bytes, table.table.to_parquet())
        self._tables.set(name, data, tag=tag)

    def get(self, name: str) -> TableContainer:
        """Get a table from the store."""
        data = BytesIO(cast(bytes, self._tables.get(name)))
        return TableContainer(table=pd.read_parquet(data))

    def remove(self, name: str) -> None:
        """Remove a table from the store."""
        del self._tables[name]
        del self._keys[name]

    def list(self, tag: str | None = None) -> list[str]:
        """List the tables in the store."""
        if tag is None:
            return list(self._keys.keys())
        return list([name for name, table in self._keys.items() if table == tag])

    def dispose(self) -> None:
        """Clear the store."""
        self._tables.clear()
        self._tables.close()
        shutil.rmtree(self._tables.directory)
