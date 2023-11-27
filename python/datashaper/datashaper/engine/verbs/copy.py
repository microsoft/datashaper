#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
from ...table_store import TableContainer
from .verb_input import VerbInput


def copy(
    input: VerbInput,
    to: str,
    column: str,
):
    input[to] = input[column]

    return TableContainer(table=input)
