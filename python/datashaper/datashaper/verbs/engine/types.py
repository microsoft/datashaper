"""Datashaper Engine types."""

from collections.abc import Callable
from dataclasses import dataclass
from typing import Generic, TypeVar

from datashaper.table_store.types import TableContainer

T = TypeVar("T")


@dataclass
class VerbResult(Generic[T]):
    """A container for the results from a verb that emits multiple tables."""

    output: TableContainer[T]
    named_outputs: dict[str, TableContainer[T]]


@dataclass
class VerbDetails:
    """Options for verbs."""

    name: str
    """Name of the verb."""

    func: Callable[
        ...,
        VerbResult,
    ]
    """Function to execute."""

    treats_input_tables_as_immutable: bool = False
    """Whether the verb is free from mutations on input tables."""
