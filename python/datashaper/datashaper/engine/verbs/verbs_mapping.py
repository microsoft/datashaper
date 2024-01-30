#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from functools import cache
from typing import Any, Callable, Coroutine

from dataclasses import dataclass, field

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


@dataclass
class VerbDetails:
    """Options for verbs."""

    name: str
    """Name of the verb."""

    func: Callable[..., TableContainer] | Coroutine[Any, Any, TableContainer]
    """Function to execute."""

    treats_input_tables_as_immutable: bool = False
    """Whether the verb is free from mutations on input tables."""


@dataclass
class VerbManager:
    """Manages the verbs and their functions."""

    _verbs: dict[str, VerbDetails] = field(default_factory=dict)

    def __getitem__(self, verb: str) -> VerbDetails:
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

    def get_verb(self, verb: str) -> VerbDetails:
        return self._verbs.get(verb)

    @classmethod
    @cache
    def get(cls) -> "VerbManager":
        """Returns the verb manager."""
        return cls()
