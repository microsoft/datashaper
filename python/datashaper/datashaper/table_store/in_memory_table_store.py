#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""The tablestore module contains the table store classes used by the datashaper."""

from dataclasses import dataclass

from datashaper.table_store.table_store import TableStore
from datashaper.table_store.types import TableContainer


@dataclass
class Item:
    """A simple item class."""

    table_container: TableContainer
    tag: str


class InMemoryTableStore(TableStore):
    """A default table store implementation."""

    def __init__(self) -> None:
        """Initialize the default table store."""
        self._tables: dict[str, Item] = {}

    def add(self, name: str, table: TableContainer, tag: str = "default") -> None:
        """Add a table to the store."""
        self._tables[name] = Item(table, tag)

    def get(self, name: str) -> TableContainer:
        """Get a table from the store."""
        return self._tables[name].table_container

    def remove(self, name: str) -> None:
        """Remove a table from the store."""
        del self._tables[name]

    def list(self, tag: str | None = None) -> list[str]:
        """List the tables in the store."""
        if tag is None:
            return list(self._tables.keys())
        return list([name for name, item in self._tables.items() if item.tag == tag])

    def dispose(self) -> None:
        """Clear the store."""
        self._tables.clear()
