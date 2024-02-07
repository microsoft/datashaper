#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""A class to represent the table inputs into a verb."""
from typing import cast

from datashaper.errors import InvalidVerbInputError
from datashaper.table_store import Table, TableContainer


class VerbInput:
    """A class to represent the table inputs into a verb."""

    source: TableContainer
    others: list[TableContainer] | None = None

    def __init__(
        self,
        input: TableContainer | None = None,
        source: TableContainer | None = None,
        other: TableContainer | None = None,
        others: list[TableContainer] | None = None,
    ):
        if input is None and source is None:
            raise InvalidVerbInputError("At least input or source must be provided")

        if input is not None and source is not None:
            raise InvalidVerbInputError("Only one of input or source can be provided")

        if other is not None and others is not None:
            raise InvalidVerbInputError("Only one of other or others can be provided")

        self.source = input if input is not None else cast(TableContainer, source)

        if other is not None or others is not None:
            self.others = [other] if other is not None else others

    def get_input(self) -> Table:
        """Get the input table."""
        return self.source.table

    def get_others(self) -> list[Table]:
        """Get the other tables."""
        if self.others is None:
            return []
        return [other.table for other in self.others]
