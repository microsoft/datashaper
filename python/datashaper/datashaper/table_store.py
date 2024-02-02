#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""The tablestore module contains the table store classes used by the datashaper."""

import os
import shutil
import tempfile

from abc import ABC, abstractmethod
from functools import lru_cache
from typing import Any, Generic, TypeVar

import pandas as pd

from dataclasses import dataclass
from pandas.core.groupby import DataFrameGroupBy

from datashaper.engine.types import Bin, Category, DataType


@dataclass
class ColumnStats:
    """Generated column statistics."""

    type: DataType
    count: int
    distinct: int
    invalid: int
    mode: Any
    min: float | None = None
    max: float | None = None
    mean: float | None = None
    median: float | None = None
    stdev: float | None = None
    bins: list[Bin] | None = None
    categories: list[Category] | None = None


@dataclass
class ColumnMetadata:
    """Column metadata container."""

    name: str
    type: DataType
    stats: ColumnStats


@dataclass
class TableMetadata:
    """Table metadata container."""

    rows: int
    cols: int
    columns: dict[str, ColumnMetadata]


T = TypeVar("T")


Table = pd.DataFrame | DataFrameGroupBy


@dataclass
class TableContainer(Generic[T]):
    """A container for a table and its metadata."""

    table: Table

    # TODO: is this used? should we use it?
    metadata: TableMetadata | None = None
    context: T | None = None


class TableStore(ABC):
    """A table store for storing and retrieving tables."""

    @abstractmethod
    def add(self, name: str, table: Table) -> None:
        """Add a table to the store."""
        pass

    @abstractmethod
    def get(self, name: str) -> TableContainer:
        """Get a table from the store."""
        pass

    @abstractmethod
    def remove(self, name: str) -> None:
        """Remove a table from the store."""
        pass

    @abstractmethod
    def list(self) -> list[str]:
        """List the tables in the store."""
        pass

    @abstractmethod
    def clear(self) -> None:
        """Clear the store."""
        pass


class DefaultTableStore(TableStore):
    """A default table store implementation."""

    def __init__(self) -> None:
        """Initialize the default table store."""
        self._tables: dict[str, TableContainer] = {}

    def add(self, name: str, table: TableContainer) -> None:
        """Add a table to the store."""
        self._tables[name] = table

    def get(self, name: str) -> TableContainer:
        """Get a table from the store."""
        return self._tables[name]

    def remove(self, name: str) -> None:
        """Remove a table from the store."""
        del self._tables[name]

    def list(self) -> list[str]:
        """List the tables in the store."""
        return list(self._tables.keys())

    def clear(self) -> None:
        """Clear the store."""
        self._tables.clear()


class DiskCacheTableStore(TableStore):
    """A default table store implementation."""

    def __init__(
        self, maxsize: int = 128, persist: bool = False, verbose=False
    ) -> None:
        """Initialize the disk cache table store."""
        self._path = tempfile.mkdtemp()
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
