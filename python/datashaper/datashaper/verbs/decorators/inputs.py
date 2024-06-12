#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Verb inputs decorator."""

import inspect
from collections.abc import Callable
from typing import Any, ParamSpec, TypeVar

from datashaper.verbs.engine import VerbInput

T = TypeVar("T")
P = ParamSpec("P")


def inputs(
    argument_names: dict[str, str] | None = None,
    default_argument_name: str | None = None,
    variadic_argument_name: str | None = None,
    named_input_argument: str | None = None,
) -> Callable[[Callable[P, T]], Callable[[VerbInput], T]]:
    """Decorate an execution function with input conditions.

    Args:
        required (list[str] | None): The list of required input names. Defaults to None. If present, the function will only execute if all required inputs are present.
    """

    def wrap_executor_function(
        fn: Callable[P, T],
    ) -> Callable[[VerbInput], T]:
        def wrapped_fn(input: VerbInput, *args: P.args, **kwargs: P.kwargs) -> T:
            fn_args: dict[str, Any] = {
                v: input.get_named_input(k) for k, v in (argument_names or {}).items()
            }
            if default_argument_name is not None:
                fn_args[default_argument_name] = input.get_input()
            if variadic_argument_name is not None:
                fn_args[variadic_argument_name] = input.get_others()
            if named_input_argument is not None:
                fn_args[named_input_argument] = input.get_named_inputs()

            for k, v in kwargs.items():
                if k not in fn_args:
                    fn_args[k] = v

            # # Inject any requested kwargs
            # fn_argspec = inspect.getfullargspec(fn)
            # named_args = set(fn_argspec.args)
            # fn_args = {k: v for k, v in fn_args.items() if k in named_args}

            # Use named_args as needed
            return fn(*args, **fn_args)

        return wrapped_fn

    return wrap_executor_function
