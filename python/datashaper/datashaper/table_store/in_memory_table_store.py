#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""The tablestore module contains the table store classes used by the datashaper."""

from typing import cast

from datashaper.table_store.table_store import TableStore
from datashaper.table_store.types import TableContainer


class InMemoryTableStore(TableStore):
    """A default table store implementation."""

    def __init__(self) -> None:
        """Initialize the default table store."""
        self._tables: dict[str, dict[str, TableContainer | str]] = {}

    def add(self, name: str, table: TableContainer, tag: str = "default") -> None:
        """Add a table to the store."""
        self._tables[name] = {"table": table, "tag": tag}

    def get(self, name: str) -> TableContainer:
        """Get a table from the store."""
        return cast(TableContainer, self._tables[name]["table"])

    def remove(self, name: str) -> None:
        """Remove a table from the store."""
        del self._tables[name]

    def list(self, tag: str | None = None) -> list[str]:
        """List the tables in the store."""
        if tag is None:
            return list(self._tables.keys())
        return list(
            [name for name, table in self._tables.items() if table["tag"] == tag]
        )

    def dispose(self) -> None:
        """Clear the store."""
        self._tables.clear()
