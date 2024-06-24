#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Verb inputs decorator."""

from collections.abc import Callable
from typing import Any, ParamSpec, TypeVar, cast

import pandas as pd

from datashaper.verbs.engine import VerbInput

T = TypeVar("T")
P = ParamSpec("P")


def copy_input_tables(
    *names: str,
) -> Callable[[Callable[P, T]], Callable[[VerbInput], T]]:
    """Decorate an execution function with input conditions.

    Args:
        required (list[str] | None): The list of required input names. Defaults to None. If present, the function will only execute if all required inputs are present.
    """

    def wrap_executor_function(
        fn: Callable[P, T],
    ) -> Callable[[VerbInput], T]:
        def wrapped_fn(*args: P.args, **kwargs: P.kwargs) -> T:
            fn_args: dict[str, Any] = {
                **kwargs,
            }
            for name in names:
                if name not in fn_args:
                    raise ValueError
                fn_args[name] = cast(pd.DataFrame, fn_args[name].copy())
            return fn(*args, **fn_args)

        return wrapped_fn

    return wrap_executor_function
