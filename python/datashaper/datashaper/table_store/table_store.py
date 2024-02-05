#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""The tablestore module contains the table store classes used by the datashaper."""
from abc import ABC, abstractmethod

from .types import TableContainer


class TableStore(ABC):
    """A table store for storing and retrieving tables."""

    @abstractmethod
    def add(self, name: str, table: TableContainer) -> None:
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
