#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import Optional, cast

from datashaper.table_store import Table, TableContainer


class VerbInput:
    _source: TableContainer
    _others: list[TableContainer] | None = None

    def __init__(
        self,
        input: Optional[TableContainer] = None,
        source: Optional[TableContainer] = None,
        other: Optional[TableContainer] = None,
        others: Optional[list[TableContainer]] = None,
    ):
        if input is None and source is None:
            raise Exception("At least input or source must be provided")

        if input is not None and source is not None:
            raise Exception("Only one of input or source can be provided")

        if other is not None and others is not None:
            raise Exception("Only one of other or others can be provided")

        self._source = input if input is not None else cast(TableContainer, source)

        if other is not None or others is not None:
            self._others = [other] if other is not None else others

    def get_input(self) -> Table:
        return self._source.table

    def get_others(self) -> list[Table]:
        if self._others is None:
            return []
        return [other.table for other in self._others]
