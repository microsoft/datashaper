"""Contains the workflow verb definition."""

from typing import Any

import pandas as pd
from reactivedataflow import ConfigPort, InputPort, verb

from datashaper.constants import DEFAULT_INPUT_NAME

from .decorators import OutputMode, wrap_verb_result
from .types import Table


@verb(
    name="workflow",
    ports=[
        ConfigPort(name="workflow", required=True),
        ConfigPort(name="workflow_instance", required=True),
    ],
    # TODO: add support for multiple input tables
    adapters=[
        wrap_verb_result(mode=OutputMode.Table),
    ],
)
async def workflow(
    table: pd.DataFrame,
    workflow: dict,
    workflow_instance: Any,  # Workflow
    tables: dict[str, Any] | None = None,
    **_kwargs: Any,
) -> Table:
    """Apply a sequence of operations to the input table."""
    # Set up the input tables for the subworkflow
    input_tables: dict[str, pd.DataFrame] = {
        DEFAULT_INPUT_NAME: table,
        **(tables or {}),
    }

    # Create and run the subworkflow
    subworkflow = workflow_instance.derive(workflow, input_tables)
    await subworkflow.run()

    # Return the output table
    return subworkflow.output()
