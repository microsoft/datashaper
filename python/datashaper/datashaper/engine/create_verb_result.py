#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#
"""Common types used across the datashaper codebase."""

from datashaper.types import Table, TableContainer, TableMetadata, VerbResult


def create_verb_result(
    table: Table,
    metadata: TableMetadata | None = None,
    named_outputs: dict[str, TableContainer] | None = None,
) -> VerbResult:
    """Create a VerbResult from a table and metadata."""
    return VerbResult(
        output=TableContainer(table=table, metadata=metadata),
        named_outputs=named_outputs or {},
    )
