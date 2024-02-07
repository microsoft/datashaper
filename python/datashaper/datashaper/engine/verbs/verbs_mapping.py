#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Verb decorators and manager."""

import asyncio
import math
import traceback
from collections import namedtuple
from dataclasses import dataclass, field
from enum import Enum
from functools import cache
from inspect import signature
from typing import Any, Awaitable, Callable, Concatenate, ParamSpec

import numpy as np
import pandas as pd

from datashaper.engine.verbs import VerbInput
from datashaper.progress import ProgressTicker, progress_ticker
from datashaper.table_store import Table, TableContainer


def verb(
    name: str,
    treats_input_tables_as_immutable: bool = False,
    override_existing: bool = False,
    **kwargs,
) -> Callable:
    """Apply a decorator for registering a verb."""

    def inner(func: Callable[..., TableContainer]) -> Callable[..., TableContainer]:
        verb = VerbDetails(
            name=name,
            func=func,
            treats_input_tables_as_immutable=treats_input_tables_as_immutable,
        )
        VerbManager.get().register(verb, override_existing)
        return func

    return inner


class AsyncIOType(str, Enum):
    """Enum for asyncio type."""

    ASYNCIO = "asyncio"
    THREADED = "threaded"


def new_row(old_tuple: tuple, new_column_name: str, value: Any) -> tuple:
    """Return rows in row-wise operations."""
    old_named_tuple_type = type(old_tuple)
    original_fields = old_named_tuple_type._fields  # type: ignore
    return namedtuple("NewRow", original_fields + (new_column_name,))(
        *(old_tuple + (value,))
    )


P = ParamSpec("P")


def parallel_verb(
    name: str,
    treats_input_tables_as_immutable: bool = False,
    override_existing: bool = False,
    asyncio_type: AsyncIOType = AsyncIOType.ASYNCIO,
    **kwargs,
) -> Callable:
    """Apply a decorator for registering a parallel verb."""

    def inner(
        func: Callable[Concatenate[Table | tuple, P], Awaitable[Table]],
    ) -> Callable[Concatenate[VerbInput, Any, int, P], Awaitable[TableContainer]]:
        @verb(
            name=name,
            treats_input_tables_as_immutable=treats_input_tables_as_immutable,
            override_existing=override_existing,
        )
        async def wrapper(
            input: VerbInput,
            callbacks: Any,  # TODO: Change this to VerbCallbacks once I figure out the circular import issue
            max_parallelism: int = 4,
            *args: P.args,
            **kwargs: P.kwargs,
        ):
            input_table = input.source.table
            chunk_size: int = kwargs.pop("chunk_size", 1)  # type: ignore
            if chunk_size == 1:
                chunks = input_table.itertuples()
            elif (
                chunk_size > 0
                and signature(func).parameters["chunk"].annotation == Table
                and signature(func).return_annotation == Table
            ):
                chunks = np.array_split(  # type: ignore
                    input_table,  # type: ignore
                    math.ceil(len(input_table) / chunk_size),  # type: ignore
                )
            else:
                raise NotImplementedError(
                    "chunk_size > 1 is only supported for DataFrame inputs and outputs. Use chunk_size = 1 for item-wise operations."
                )

            tick = progress_ticker(
                callbacks.progress,
                num_total=len(chunks) if chunk_size > 1 else len(input_table),  # type: ignore
            )
            errors = []
            stack_traces = []

            async def execute(
                chunk: Table | tuple,
                tick: ProgressTicker,
                semaphore: asyncio.Semaphore,
                /,
                *args: P.args,
                **kwargs: P.kwargs,
            ) -> Table | tuple | None:
                async with semaphore:
                    try:
                        output = await func(chunk, *args, **kwargs)
                        tick(1)
                        return output
                    except Exception as e:
                        stack_trace = traceback.format_exc()
                        print(stack_trace)
                        stack_traces.append(stack_trace)
                        errors.append(e)
                        return None

            semaphore = asyncio.Semaphore(max_parallelism)
            futures = [
                execute(chunk, tick, semaphore, *args, **kwargs) for chunk in chunks
            ]

            if asyncio_type == AsyncIOType.THREADED:
                futures = [asyncio.to_thread(future) for future in futures]  # type: ignore

            results = await asyncio.gather(*futures)

            tick.done()

            for error, stack_trace in zip(errors, stack_traces):
                callbacks.error(
                    "Received errors during parallel transformation",
                    error,
                    stack=stack_trace,
                )
            if len(errors) > 0:
                raise ValueError(
                    "Errors occurred while running parallel transformation, could not complete!"
                )
            if chunk_size > 1:
                return TableContainer(pd.concat(results))  # type: ignore
            else:
                return TableContainer(pd.DataFrame(results))

        return wrapper

    return inner


@dataclass
class VerbDetails:
    """Options for verbs."""

    name: str
    """Name of the verb."""

    func: Callable[..., TableContainer]
    """Function to execute."""

    treats_input_tables_as_immutable: bool = False
    """Whether the verb is free from mutations on input tables."""


@dataclass
class VerbManager:
    """Manages the verbs and their functions."""

    _verbs: dict[str, VerbDetails] = field(default_factory=dict)

    def __getitem__(self, verb: str) -> VerbDetails | None:
        """Get a verb by name."""
        return self.get_verb(verb)

    def __contains__(self, verb: str) -> bool:
        """Check if a verb is registered."""
        return verb in self._verbs

    def register_verbs(
        self, verbs: dict[str, Callable], override_existing=False
    ) -> None:
        """Register verbs."""
        for name, func in verbs.items():
            self.register(VerbDetails(name=name, func=func), override_existing)

    def register(self, verb: VerbDetails, override_existing=False) -> None:
        """Register a verb."""
        if not override_existing and verb.name in self._verbs:
            raise ValueError(f"Verb {verb.name} already registered.")
        self._verbs.update({verb.name: verb})

    def get_verb(self, verb: str) -> VerbDetails | None:
        """Get a verb by name."""
        return self._verbs.get(verb)

    @classmethod
    @cache
    def get(cls) -> "VerbManager":
        """Get the verb manager."""
        return cls()
