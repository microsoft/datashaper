#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""A class to represent the table inputs into a verb."""

from typing import cast

from datashaper.verbs.types import Table, TableContainer


class VerbInput:
    """A class to represent the table inputs into a verb."""

    _source: TableContainer | None
    _others: list[TableContainer]
    _named: dict[str, TableContainer]

    def __init__(
        self,
        source: TableContainer | None = None,
        others: list[TableContainer] | None = None,
        named: dict[str, TableContainer] | None = None,
    ):
        self._source = source
        self._named = named or {}
        self._others = others or []

    def get_input(self) -> Table:
        """Get the input table."""
        if self._source is None:
            # TODO: handle nulls properly
            return cast(Table, None)
        return self._source.table

    def get_others(self) -> list[Table]:
        """Get the other tables."""
        if self._others is None:
            return []
        return [other.table for other in self._others]

    def get_named_input(self, name: str) -> Table | None:
        """Get the named input table."""
        input = self._named.get(name)
        if input is None:
            return None
        return input.table

    def get_named_inputs(self) -> dict[str, Table]:
        """Get the named input tables."""
        return {name: input.table for name, input in self._named.items()}
