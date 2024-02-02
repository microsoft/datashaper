#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import asyncio
import math
import traceback

from collections import namedtuple
from functools import cache
from inspect import signature
from typing import Callable

import numpy as np
import pandas as pd

from dataclasses import dataclass, field
from traitlets import Any

from datashaper.engine.verbs import VerbInput
from datashaper.progress import ProgressTicker, progress_ticker
from datashaper.table_store import TableContainer


def verb(
    name: str,
    treats_input_tables_as_immutable: bool = False,
    override_existing: bool = False,
    **kwargs,
) -> Callable:
    """Decorator for registering a verb."""

    def inner(func: Callable[..., TableContainer]) -> Callable[..., TableContainer]:
        verb = VerbDetails(
            name=name,
            func=func,
            treats_input_tables_as_immutable=treats_input_tables_as_immutable,
        )
        VerbManager.get().register(verb, override_existing)
        return func

    return inner


def new_row(old_tuple: tuple, new_column_name: str, value: Any) -> tuple:
    """Helper function to return rows in row-wise operations."""
    old_named_tuple_type = type(old_tuple)
    return namedtuple(
        old_named_tuple_type.__name__, old_named_tuple_type._fields + (new_column_name,)
    )(*(old_tuple + (value,)))


def parallel_verb(
    name: str,
    treats_input_tables_as_immutable: bool = False,
    override_existing: bool = False,
    asyncio_type: str = "asyncio",
    **kwargs,
) -> Callable:
    """Decorator for registering a parallel verb."""

    def inner(func: Callable[..., pd.DataFrame]) -> Callable[..., TableContainer]:
        @verb(
            name=name,
            treats_input_tables_as_immutable=treats_input_tables_as_immutable,
            override_existing=override_existing,
        )
        async def wrapper(
            input: VerbInput,
            callbacks: Any,
            max_parallelism: int = 4,
            *args,
            **kwargs,
        ):
            input_table = input.source.table
            chunk_size = kwargs.pop("chunk_size", 1)
            if chunk_size == 1:
                chunks = input_table.itertuples()
            elif (
                chunk_size > 0
                and signature(func).parameters["chunk"].annotation == pd.DataFrame
                and signature(func).return_annotation == pd.DataFrame
            ):
                chunks = np.array_split(
                    input_table, math.ceil(len(input_table) / chunk_size)
                )
            else:
                raise NotImplementedError(
                    "chunk_size > 1 is only supported for DataFrame inputs and outputs. Use chunk_size = 1 for item-wise operations."
                )

            tick = progress_ticker(
                callbacks.progress,
                num_total=len(chunks) if chunk_size > 1 else len(input_table),
            )
            errors = []

            async def execute(
                chunk: pd.DataFrame | tuple, tick: ProgressTicker, *args, **kwargs
            ) -> pd.DataFrame | tuple:
                try:
                    output = await func(chunk=chunk, *args, **kwargs)
                    tick(1)
                    return output
                except Exception as e:
                    traceback.print_exc()
                    errors.append(e)
                    return None

            futures = [
                execute(chunk=chunk, tick=tick, *args, **kwargs) for chunk in chunks
            ]
            if asyncio_type == "threaded":
                futures = [asyncio.to_thread(future) for future in futures]

            async with asyncio.Semaphore(max_parallelism):
                results = await asyncio.gather(*futures)

            tick.done()

            for error in errors:
                callbacks.error("Received errors during parallel transformation", error)
            if len(errors) > 0:
                raise ValueError(
                    "Errors occurred while running parallel transformation, could not complete!"
                )
            if chunk_size > 1:
                return TableContainer(pd.concat(results))
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
        return self.get_verb(verb)

    def __contains__(self, verb: str) -> bool:
        return verb in self._verbs

    def register_verbs(
        self, verbs: dict[str, Callable], override_existing=False
    ) -> None:
        """Registers verbs."""
        for name, func in verbs.items():
            self.register(VerbDetails(name=name, func=func), override_existing)

    def register(self, verb: VerbDetails, override_existing=False) -> None:
        """Registers a verb."""
        if not override_existing and verb.name in self._verbs:
            raise ValueError(f"Verb {verb.name} already registered.")
        self._verbs.update({verb.name: verb})

    def get_verb(self, verb: str) -> VerbDetails | None:
        return self._verbs.get(verb)

    @classmethod
    @cache
    def get(cls) -> "VerbManager":
        """Returns the verb manager."""
        return cls()
