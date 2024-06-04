#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Common types used across the datashaper codebase."""

from datashaper.table_store.types import Table, TableContainer, TableMetadata

from .types import VerbResult


def create_verb_result(
    table: Table | TableContainer,
    metadata: TableMetadata | None = None,
    named_outputs: dict[str, TableContainer] | None = None,
) -> VerbResult:
    """Create a VerbResult from a table and metadata."""
    raw_table = table.table if isinstance(table, TableContainer) else table
    return VerbResult(
        output=TableContainer(table=raw_table, metadata=metadata),
        named_outputs=named_outputs or {},
    )
