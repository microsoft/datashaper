#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Verb decorators and manager."""

import logging
import inspect
from collections.abc import Callable
from inspect import signature
from typing import Any

import pandas as pd
from pandas.core.groupby import DataFrameGroupBy

from datashaper.engine.create_verb_result import create_verb_result
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verb_manager import VerbManager
from datashaper.types import TableContainer, VerbDetails, VerbResult

log = logging.getLogger(__name__)


def verb(
    name: str,
    treats_input_tables_as_immutable: bool = False,
    override_existing: bool = False,
    raw: bool = False,
    **_kwargs: Any,
) -> Callable:
    """Apply a decorator for registering a verb."""

    def registered_verb(verb_function: Callable) -> Callable[..., VerbResult]:
        target_function = verb_function if raw else _wrap_verb_function(verb_function)
        verb = VerbDetails(
            name=name,
            func=target_function,
            treats_input_tables_as_immutable=treats_input_tables_as_immutable,
        )
        VerbManager.get().register(verb, override_existing)
        return verb_function

    return registered_verb


def _wrap_verb_function(verb_function: Callable) -> Callable[..., VerbResult]:
    """Handle the verb function."""
    sig = signature(verb_function)

    # If the verb function returns a DataFrame, wrap it in a VerbResult
    if (
        sig.return_annotation == pd.DataFrame
        or sig.return_annotation == DataFrameGroupBy
        or sig.return_annotation == (pd.DataFrame | DataFrameGroupBy)
    ):
        verb_function = _handle_dataframe_return_type(verb_function)
    elif sig.return_annotation == tuple[pd.DataFrame, dict[str, pd.DataFrame]]:
        verb_function = _handle_tuple_return_type(verb_function)
    elif sig.return_annotation != VerbResult:
        log.warning("sig.return_annotation", verb_function, sig.return_annotation)
        msg = f"Verb function {verb_function} must return a DataFrame, a tuple, or VerbResult. Found {sig.return_annotation}."
        raise ValueError(msg)

    # Wire in Input Tables
    has_table_argument = "table" in sig.parameters
    has_other_argument = "other" in sig.parameters
    has_others_argument = "others" in sig.parameters
    return _handle_input_table_arguments(
        verb_function, has_table_argument, has_other_argument, has_others_argument
    )


def _handle_input_table_arguments(
    verb_function: Callable[..., VerbResult],
    has_table_argument: bool,
    has_other_argument: bool,
    has_others_argument: bool,
) -> Callable[..., VerbResult]:
    """Handle the input table arguments of the verb function."""

    def wrapper(input: VerbInput, **kwargs: Any) -> VerbResult:
        input_table = input.get_input()
        others = input.get_others()

        args_dict: dict[str, Any] = {}

        if has_table_argument:
            args_dict["table"] = input_table
        if has_other_argument:
            args_dict["other"] = others[0] if others else None
        if has_others_argument:
            args_dict["others"] = others

        # TODO: cull down kwargs to actual args
        return verb_function(**args_dict, **kwargs)

    return wrapper


def _handle_dataframe_return_type(
    verb_function: Callable[..., pd.DataFrame],
) -> Callable[..., VerbResult]:
    """Handle the return type of the verb function."""

    async def wrapper(*args: Any, **kwargs: Any) -> VerbResult:
        result = verb_function(*args, **kwargs)
        if inspect.iscoroutine(result):
            result = await result
        return create_verb_result(result)

    return wrapper


def _handle_tuple_return_type(
    verb_function: Callable[..., tuple[pd.DataFrame, dict[str, pd.DataFrame | None]]],
) -> Callable[..., VerbResult]:
    """Handle the return type of the verb function."""

    def wrapper(*args: Any, **kwargs: Any) -> VerbResult:
        result, others = verb_function(*args, **kwargs)
        others = {k: TableContainer(v) for k, v in others.items() if v is not None}
        return create_verb_result(result, named_outputs=others)

    return wrapper
