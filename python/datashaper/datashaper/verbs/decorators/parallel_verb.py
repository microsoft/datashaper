#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Verb decorators and manager."""

import asyncio
import logging
import math
import traceback
from collections import namedtuple
from collections.abc import Awaitable, Callable, Sized
from enum import Enum
from inspect import signature
from typing import Any, Concatenate, ParamSpec, cast

import numpy as np
import pandas as pd

from datashaper.errors import VerbParallelizationError
from datashaper.utils.parallelization import AsyncStrategy
from datashaper.utils.progress import ProgressTicker, progress_ticker
from datashaper.verbs.callbacks import VerbCallbacks
from datashaper.verbs.engine.verb_input import VerbInput
from datashaper.verbs.types import Table, TableContainer

from .verb import verb

logger = logging.getLogger(__name__)


P = ParamSpec("P")

_CHUNKS_NOT_SUPPORTED = "chunk_size > 1 is only supported for DataFrame inputs and outputs. Use chunk_size = 1 for item-wise operations."

_DEFAULT_CHUNK_SIZE = 250


class ParallelizationMode(str, Enum):
    """The type of operation to perform."""

    ROW_WISE = "row_wise"
    CHUNK = "chunk"


def new_row(old_tuple: tuple, new_column_name: str, value: Any) -> tuple:
    """Emit a new row for a row-wise operations."""
    old_named_tuple_type = type(old_tuple)
    original_fields = old_named_tuple_type._fields  # type: ignore
    return namedtuple("NewRow", original_fields + (new_column_name,))(  # noqa: PYI024
        *(old_tuple + (value,))
    )


def default_merge(results: list[Table | tuple | None]) -> Table:
    """Merge a collection of parallel results into a table."""
    return pd.concat([cast(pd.DataFrame, r) for r in results if results is not None])


def parallel_verb(
    name: str,
    treats_input_tables_as_immutable: bool = False,
    override_existing: bool = False,
    asyncio_type: AsyncStrategy = AsyncStrategy.AsyncIO,
    merge: Callable[[list[Table | tuple | None]], Table] = default_merge,
    parallelization_mode: ParallelizationMode = ParallelizationMode.ROW_WISE,
    **_kwargs: Any,
) -> Callable:
    """Apply a decorator for registering a parallel verb."""

    def inner(
        func: Callable[Concatenate[Table | tuple, P], Awaitable[Table]],
    ) -> Callable[
        Concatenate[VerbInput, Any, int, P],
        Awaitable[TableContainer],
    ]:
        @verb(
            name=name,
            treats_input_tables_as_immutable=treats_input_tables_as_immutable,
            override=override_existing,
        )
        async def wrapper(
            input: VerbInput,
            callbacks: VerbCallbacks,
            max_parallelism: int = 4,
            *args: P.args,
            **kwargs: P.kwargs,
        ) -> TableContainer:
            input_table = input.get_input()
            if parallelization_mode == ParallelizationMode.ROW_WISE:
                chunks = input_table.itertuples()
            elif (
                signature(func).parameters["chunk"].annotation == Table
                and signature(func).return_annotation == Table
            ):
                chunk_size: int = cast(
                    int, kwargs.pop("chunk_size", _DEFAULT_CHUNK_SIZE)
                )
                chunks = np.array_split(
                    cast(pd.DataFrame, input_table),
                    math.ceil(len(input_table) / chunk_size),
                )
            else:
                raise NotImplementedError(_CHUNKS_NOT_SUPPORTED)

            tick = progress_ticker(
                callbacks.progress,
                num_total=len(cast(Sized, chunks))
                if parallelization_mode == ParallelizationMode.CHUNK
                else len(input_table),
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
                        output = await func(
                            chunk, *args, **{"callbacks": callbacks, **kwargs}
                        )
                        tick(1)
                    except Exception as e:
                        stack_trace = traceback.format_exc()
                        logger.exception("Error executing parallel verb.")
                        stack_traces.append(stack_trace)
                        errors.append(e)
                        return None
                    else:
                        return output

            semaphore = asyncio.Semaphore(max_parallelism)
            futures = [
                execute(cast(Table, chunk), tick, semaphore, *args, **kwargs)
                for chunk in chunks
            ]

            if asyncio_type == AsyncStrategy.Threaded:
                futures = [asyncio.to_thread(future) for future in futures]  # type: ignore

            results = await asyncio.gather(*futures)

            tick.done()

            for error, stack_trace in zip(errors, stack_traces, strict=True):
                callbacks.error(
                    "Received errors during parallel transformation",
                    error,
                    stack=stack_trace,
                )
            if len(errors) > 0:
                raise VerbParallelizationError(len(errors))
            if parallelization_mode == ParallelizationMode.CHUNK:
                return TableContainer(merge(results))

            return TableContainer(pd.DataFrame(results))

        return wrapper

    return inner
