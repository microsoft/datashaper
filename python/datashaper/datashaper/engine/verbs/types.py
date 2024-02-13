"""Verb Management types."""
from collections.abc import Callable
from dataclasses import dataclass

from datashaper.table_store.types import VerbResult


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
