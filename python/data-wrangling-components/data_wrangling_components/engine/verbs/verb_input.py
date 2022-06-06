#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from typing import List

from data_wrangling_components.table_store import TableContainer


class VerbInput:
    source: TableContainer
    others: List[TableContainer] = None

    def __init__(
        self,
        input: TableContainer = None,
        source: TableContainer = None,
        other: TableContainer = None,
        others: List[TableContainer] = None,
    ):
        if input is None and source is None:
            raise Exception("At least input or source must be provided")

        if input is not None and source is not None:
            raise Exception("Only one of input or source can be provided")

        if other is not None and others is not None:
            raise Exception("Only one of other or others can be provided")

        self.source = input if input is not None else source

        if other is not None or others is not None:
            self.others = [other] if other is not None else others

    def get_input(self):
        return self.source.table

    def get_others(self):
        return [other.table for other in self.others]
