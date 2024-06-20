#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Verb decorators and manager."""

from collections.abc import Callable
from dataclasses import dataclass, field
from functools import cache

from datashaper.errors import VerbAlreadyRegisteredError

from .types import VerbDetails


@dataclass
class VerbManager:
    """Manages the verbs and their functions."""

    _verbs: dict[str, VerbDetails] = field(default_factory=dict)

    def __getitem__(self, verb: str) -> VerbDetails | None:
        """Get a verb by name."""
        return self.get_verb(verb)

    def __contains__(self, verb: str) -> bool:
        """Check if a verb is registered."""
        return verb in self._verbs

    def register_verbs(
        self, verbs: dict[str, Callable], override_existing: bool = False
    ) -> None:
        """Register verbs."""
        for name, func in verbs.items():
            self.register(VerbDetails(name=name, func=func), override_existing)

    def register(self, verb: VerbDetails, override_existing: bool = False) -> None:
        """Register a verb."""
        if not override_existing and verb.name in self._verbs:
            raise VerbAlreadyRegisteredError(verb.name)
        self._verbs.update({verb.name: verb})

    def get_verb(self, verb: str) -> VerbDetails | None:
        """Get a verb by name."""
        return self._verbs.get(verb)

    @classmethod
    @cache
    def get(cls) -> "VerbManager":
        """Get the verb manager."""
        return cls()
