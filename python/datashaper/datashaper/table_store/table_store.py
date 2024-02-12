#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Abstract class to define the table store interface."""
from abc import ABC, abstractmethod

from datashaper.table_store.types import TableContainer


class TableStore(ABC):
    """A table store for storing and retrieving tables."""

    @abstractmethod
    def add(self, name: str, table: TableContainer, tag: str = "default") -> None:
        """Add a table to the store."""

    @abstractmethod
    def get(self, name: str) -> TableContainer:
        """Get a table from the store."""

    @abstractmethod
    def remove(self, name: str) -> None:
        """Remove a table from the store."""

    @abstractmethod
    def list(self, tag: str | None = None) -> list[str]:
        """List the tables in the store."""

    @abstractmethod
    def dispose(self) -> None:
        """Clear the store."""
