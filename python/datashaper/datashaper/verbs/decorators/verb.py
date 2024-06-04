#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Verb decorators and manager."""

import inspect
import logging
from collections.abc import Callable
from inspect import signature
from typing import Any, cast

import pandas as pd
from pandas.core.groupby import DataFrameGroupBy

from datashaper.constants import DEFAULT_OUTPUT_NAME
from datashaper.table_store.types import TableContainer
from datashaper.verbs.engine import (
    VerbDetails,
    VerbInput,
    VerbManager,
    VerbResult,
    create_verb_result,
)

log = logging.getLogger(__name__)


class VerbInputSpec:
    """Verb input specification."""

    def __init__(
        self,
        name: str | None = None,
        # TODO: should we augment `named` with "required" information?
        named: list[str] | None = None,
        named_dict: str | None = None,
        variadic: str | None = None,
        immutable: bool = False,
    ):
        self.name = name
        self.named = named
        self.variadic = variadic
        self.immutable = immutable
        self.named_dict = named_dict


def verb(
    name: str,
    override_existing: bool = False,
    input: VerbInputSpec | None = None,
    raw: bool = False,
    **_kwargs: Any,
) -> Callable:
    """Apply a decorator for registering a verb."""

    def registered_verb(verb_function: Callable) -> Callable[..., VerbResult]:
        target_function = (
            _wrap_verb_function(verb_function, input) if not raw else verb_function
        )
        verb = VerbDetails(
            name=name,
            func=target_function,
            treats_input_tables_as_immutable=input.immutable if input else False,
        )
        VerbManager.get().register(verb, override_existing)
        return verb_function

    return registered_verb


def _wrap_verb_function(
    verb_function: Callable, input: VerbInputSpec | None
) -> Callable[..., VerbResult]:
    """Handle the verb function."""
    sig = signature(verb_function)

    # If the verb function returns a DataFrame, wrap it in a VerbResult
    if _is_table_return_signature(sig):
        verb_function = _handle_dataframe_return_type(verb_function)
    elif sig.return_annotation == dict[str, pd.DataFrame]:
        verb_function = _handle_dict_return_type(verb_function)
    elif sig.return_annotation != VerbResult:
        log.warning("sig.return_annotation", verb_function, sig.return_annotation)
        msg = f"Verb function {verb_function} must return a DataFrame, a tuple, or VerbResult. Found {sig.return_annotation}."
        raise ValueError(msg)

    if input:
        verb_function = _handle_input_spec(verb_function, input)

    return verb_function


def _is_table_return_signature(sig: inspect.Signature) -> bool:
    return (
        sig.return_annotation == pd.DataFrame
        or sig.return_annotation == DataFrameGroupBy
        or sig.return_annotation == (pd.DataFrame | DataFrameGroupBy)
        or sig.return_annotation == TableContainer
    )


def _handle_input_spec(
    verb_function: Callable[..., VerbResult], input_spec: VerbInputSpec
) -> Callable[..., VerbResult]:
    """Handle the input specification of the verb function."""
    sig = signature(verb_function)

    def wrapper(input: VerbInput, *args: Any, **kwargs: Any) -> VerbResult:
        if input_spec.name:
            kwargs[input_spec.name] = input.get_input()

        if input_spec.named:
            for name in input_spec.named:
                if name == "other":
                    # TODO: hack for back-compat, use the named dictionary exclusively
                    other_table = input.get_others()[0]
                    if other_table is None:
                        msg = "Expected an 'other' table."
                        raise ValueError(msg)
                    kwargs[name] = other_table
                else:
                    if input.named is None:
                        msg = "Expected named tables."
                        raise ValueError(msg)
                    table = input.named.get(name)
                    kwargs[name] = table.table if table else None

        if input_spec.named_dict:
            kwargs[input_spec.named_dict] = input.named or {}

        if input_spec.variadic:
            kwargs[input_spec.variadic] = (
                [o.table for o in input.others] if input.others else []
            )

        bound_args = sig.bind(*args, **kwargs)
        bound_args.apply_defaults()
        return verb_function(*bound_args.args, **bound_args.kwargs)

    return cast(Callable, wrapper)


def _handle_dataframe_return_type(
    verb_function: Callable[..., pd.DataFrame],
) -> Callable[..., VerbResult]:
    """Handle the return type of the verb function."""

    async def wrapper(*args: Any, **kwargs: Any) -> VerbResult:
        result = verb_function(*args, **kwargs)
        if inspect.iscoroutine(result):
            result = await result
        return create_verb_result(result)

    return cast(Callable, wrapper)


def _handle_dict_return_type(
    verb_function: Callable[..., dict[str, pd.DataFrame]],
) -> Callable[..., VerbResult]:
    """Handle the return type of the verb function."""

    def wrapper(*args: Any, **kwargs: Any) -> VerbResult:
        tables = verb_function(*args, **kwargs)
        default_output = tables.pop(DEFAULT_OUTPUT_NAME, None)
        others = {k: TableContainer(v) for k, v in tables.items() if v is not None}
        if default_output is None:
            msg = f"Verb function {verb_function} must return a default output."
            raise ValueError(msg)
        return create_verb_result(default_output, named_outputs=others)

    return wrapper
