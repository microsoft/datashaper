#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Verb decorators and manager."""

import logging
from collections.abc import Callable
from typing import Any

from datashaper.verbs.engine import (
    VerbDetails,
    VerbManager,
    VerbResult,
)

log = logging.getLogger(__name__)


def verb(
    name: str,
    override_existing: bool = False,
    immutable_input: bool = False,
    **_kwargs: Any,
) -> Callable:
    """Apply a decorator for registering a verb."""

    def registered_verb(verb_function: Callable) -> Callable[..., VerbResult]:
        verb = VerbDetails(
            name=name,
            func=verb_function,
            treats_input_tables_as_immutable=immutable_input,
        )
        VerbManager.get().register(verb, override_existing)
        return verb_function

    return registered_verb
