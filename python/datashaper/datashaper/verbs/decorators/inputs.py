#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Verb inputs decorator."""

from collections.abc import Callable
from typing import Any, ParamSpec, TypeVar

from datashaper.verbs.engine import VerbInput

T = TypeVar("T")
P = ParamSpec("P")


def inputs(
    input_argnames: dict[str, str] | None = None,
    default_input_argname: str | None = None,
    variadic_input_argname: str | None = None,
    input_dict_argname: str | None = None,
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
                v: input.get_named_input(k) for k, v in (input_argnames or {}).items()
            }
            if default_input_argname is not None:
                fn_args[default_input_argname] = input.get_input()
            if variadic_input_argname is not None:
                fn_args[variadic_input_argname] = input.get_others()
            if input_dict_argname is not None:
                fn_args[input_dict_argname] = input.get_named_inputs()

            for k, v in kwargs.items():
                if k not in fn_args:
                    fn_args[k] = v

            # Use named_args as needed
            return fn(*args, **fn_args)

        return wrapped_fn

    return wrap_executor_function
