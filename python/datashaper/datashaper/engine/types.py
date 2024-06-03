#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Common types used across the datashaper engine."""

from collections.abc import Callable
from dataclasses import dataclass, field
from enum import Enum
from typing import Generic, TypeVar

from datashaper.table_store.types import TableContainer

T = TypeVar("T")


class AsyncType(str, Enum):
    """Enum for the type of async to use."""

    AsyncIO = "asyncio"
    Threaded = "threaded"


@dataclass
class Step:
    """A workflow processing step."""

    verb: str
    input: str | dict[str, str]
    output: str | dict[str, str]
    args: dict = field(default_factory=dict)


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
