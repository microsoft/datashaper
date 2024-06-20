#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Verb decorators and manager."""

import logging
from collections.abc import Callable
from typing import Any, cast

from datashaper.verbs.engine import (
    VerbDetails,
    VerbManager,
    VerbResult,
)

from .apply_decorators import apply_decorators

log = logging.getLogger(__name__)


def verb(
    name: str,
    override: bool = False,
    immutable_input: bool = False,
    adapters: list[Callable[[Callable], Callable]] | None = None,
    registry: VerbManager | None = None,
    **_kwargs: Any,
) -> Callable:
    """Apply a decorator for registering a verb."""
    registry = registry or VerbManager.get()

    def registered_verb(verb_function: Callable) -> Callable[..., VerbResult]:
        fn = verb_function
        if adapters:
            fn = apply_decorators(adapters, fn)
        fn = cast(Callable[..., VerbResult], fn)
        verb = VerbDetails(
            name=name,
            func=fn,
            treats_input_tables_as_immutable=immutable_input,
        )
        registry.register(verb, override)
        return verb_function

    return registered_verb
