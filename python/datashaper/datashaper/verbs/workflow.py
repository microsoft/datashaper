"""Contains the workflow verb definition."""

from typing import Any

import pandas as pd

from datashaper.decorators import verb
from datashaper.types import Table
from datashaper.workflow.workflow import DEFAULT_INPUT_NAME, Workflow


@verb(name="workflow")
async def workflow(
    table: pd.DataFrame,
    workflow: dict,
    workflow_instance: Workflow,
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
