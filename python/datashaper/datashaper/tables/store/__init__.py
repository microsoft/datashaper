"""The tablestore module contains the table store classes used by the datashaper."""

from .disk_cache_table_store import DiskCacheTableStore
from .in_memory_table_store import InMemoryTableStore
from .table_store import TableStore

__all__ = [
    "DiskCacheTableStore",
    "InMemoryTableStore",
    "TableStore",
]
