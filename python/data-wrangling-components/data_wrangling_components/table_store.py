#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import (
    Any,
    Callable,
    Dict,
    Generic,
    List,
    Optional,
    Protocol,
    TypeVar,
    Union,
)

import pandas as pd

from dataclasses import dataclass, field
from pandas.core.groupby import DataFrameGroupBy

from data_wrangling_components.exceptions import (
    ResolverNotFoundError,
    TableNotFoundError,
)
from data_wrangling_components.types import Bin, Category, DataType


@dataclass
class ColumnStats:
    type: DataType
    count: int
    distinct: int
    invalid: int
    mode: Any
    min: Optional[float] = None
    max: Optional[float] = None
    mean: Optional[float] = None
    median: Optional[float] = None
    stdev: Optional[float] = None
    bins: Optional[List[Bin]] = None
    categories: Optional[List[Category]] = None


@dataclass
class ColumnMetadata:
    name: str
    type: DataType
    stats: ColumnStats


@dataclass
class TableMetadata:
    rows: int
    cols: int
    columns: Dict[str, ColumnMetadata]


T = TypeVar("T")


Table = Union[pd.DataFrame, DataFrameGroupBy]
ResolverFunction = Callable[[str], Table]


@dataclass
class TableContainer(Generic[T]):
    id: str
    name: Optional[str] = None
    table: Optional[Table] = None
    metadata: Optional[TableMetadata] = None
    context: Optional[T] = None


@dataclass
class LazyTableStorage:
    container: TableContainer
    resolver: Optional[ResolverFunction] = None
    resolved: bool = False


class TableStore(Protocol):
    def get(self, name: str) -> TableContainer:
        ...

    def table(self, name: str) -> Table:
        ...

    def set(self, name: str, table: TableContainer) -> None:
        ...

    def delete(self, name: str) -> None:
        ...

    def queue(self, name: str, resolver: ResolverFunction) -> None:
        ...

    def list(self, filter: Optional[str] = None) -> List[str]:
        ...

    def to_map(self) -> Dict[str, Table]:
        ...


@dataclass
class DefaultTableStore:
    _tables: Dict[str, LazyTableStorage] = field(default_factory=dict)

    def get(self, name: str) -> TableContainer:
        """Retrieves a dataframe from the table store

        :param name:
            Name of the table to retrieve
        :type name: str
        :raises TableNotFoundError:
            Raised when name does not exist in table
        :raises ResolverNotFoundError:
            Raised when the resolver is not found for that table
        :return: the dataframe with the data
        :rtype: Union[pd.DataFrame, DataFrameGroupBy]
        """
        try:
            table_container = self._tables[name]
        except KeyError:
            raise TableNotFoundError(f"No table named '{name}' found in store.")

        if not table_container.resolved:
            resolver_func = table_container.resolver
            if resolver_func is None:
                raise ResolverNotFoundError(
                    f"No resolver function for unloaded table '{name}'."
                )
            else:
                table = resolver_func(name)
                table_container.container.table = table
                table_container.resolved = True

        return table_container.container

    def table(self, name: str) -> Table:
        container = self.get(name)
        return container.table

    def set(self, name: str, table: TableContainer) -> None:
        """Sets the table for a name in the store

        :param name:
            The name of the table.
            If the name already exists then the data is overwritten
        :type name: str
        :param table:
            The DataFrame with the data
        :type table: pd.DataFrame
        """
        self._tables[name] = LazyTableStorage(table, resolved=True)

    def delete(self, name: str) -> None:
        """Deletes a table from the store

        :param name: Name of the table to delete
        :type name: str
        """
        self._tables.pop(name)

    def queue(self, name: str, resolver: ResolverFunction) -> None:
        """Queues a table to be lazy loaded with a resolver function

        :param name:
            Name of the table to be lazy loaded
        :type name: str
        :param resolver:
            The function to be used to load the table
        :type resolver: Callable[[str], pd.DataFrame]
        """
        self._tables[name] = LazyTableStorage(
            TableContainer(id=name, name=name), resolver=resolver, resolved=False
        )

    def list(self, filter: Optional[str] = None) -> List[str]:
        """Lists all tables stored in the store

        :param filter:
            Optional filter to reduce the amount of tables listed, defaults to None
        :type filter: Optional[str], optional
        :return:
            The list of table names stored in the store
        :rtype: List[str]
        """
        return [
            key for key in list(self._tables.keys()) if filter is None or filter in key
        ]

    def to_map(self) -> Dict[str, Table]:
        """Creates a map of name: DataFrame from the store

        :return:
            A Dictionary with name as key and DataFrame as value
        :rtype: Dict[str, pd.DataFrame]
        """
        return {
            table.container.name: table.container.table
            for table in self._tables.values()
            if table.container.name is not None and table.container.table is not None
        }
