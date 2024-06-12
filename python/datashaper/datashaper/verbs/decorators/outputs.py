"""Verb output decorator."""

import inspect
from collections.abc import Callable
from enum import Enum
from typing import Any, ParamSpec, cast

import pandas as pd

from datashaper.verbs.engine import (
    VerbResult,
)
from datashaper.verbs.types import TableContainer


class OutputReturnType(str, Enum):
    """Output return type."""

    Table = "table"
    Tuple = "tuple"


P = ParamSpec("P")


def outputs(
    return_type: OutputReturnType,
    output_names: list[str] | None = None,
) -> Callable[[Callable[..., Any]], Callable[..., VerbResult]]:
    """Decorate an execution function with output conditions.

    Args:
    return_type (OutputReturnType): The type of return value.
    """

    def wrap_executor_function(fn: Callable[P, Any]) -> Callable[P, VerbResult]:
        async def wrapped_fn(*args: P.args, **kwargs: P.kwargs) -> VerbResult:
            result = fn(*args, **kwargs)
            if inspect.iscoroutine(result):
                result = await result

            match return_type:
                case OutputReturnType.Table:
                    return VerbResult(output=TableContainer(result), named_outputs={})
                case OutputReturnType.Tuple:
                    result = cast(list[pd.DataFrame], list(result))
                    if output_names is None:
                        raise ValueError
                    output = result.pop(0)
                    return VerbResult(
                        output=TableContainer(output),
                        named_outputs={
                            k: TableContainer(v)
                            for k, v in zip(output_names, result, strict=True)
                        },
                    )

        return cast(Callable[P, VerbResult], wrapped_fn)

    return wrap_executor_function
