#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""The tablestore module contains the table store classes used by the datashaper."""

from .table_store import TableStore
from .types import TableContainer


class InMemoryTableStore(TableStore):
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
