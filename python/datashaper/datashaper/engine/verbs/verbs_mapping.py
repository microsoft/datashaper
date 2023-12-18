#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from functools import cache
from typing import Callable

from dataclasses import dataclass, field

from datashaper.table_store import TableContainer


def verb(*args, **kwargs) -> Callable:
    """Decorator for registering a verb."""

    def inner(func: Callable[..., TableContainer]) -> Callable[..., TableContainer]:
        VerbManager.get().register_verbs({kwargs["name"]: func})
        return func

    return inner


@dataclass
class VerbManager:
    """Manages the verbs and their functions."""

    verbs: dict[str, Callable] = field(default_factory=dict)

    def __getitem__(self, verb: str) -> Callable[..., TableContainer]:
        return self.verbs[verb]

    def __contains__(self, verb: str) -> bool:
        return verb in self.verbs

    def register_verbs(self, verbs: dict[str, Callable]):
        self.verbs.update(verbs)

    @classmethod
    @cache
    def get(cls) -> "VerbManager":
        """Returns the verb manager."""
        return cls()
