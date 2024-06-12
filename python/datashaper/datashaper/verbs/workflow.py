"""Contains the workflow verb definition."""

from typing import Any

import pandas as pd

from datashaper.constants import DEFAULT_INPUT_NAME

from .decorators import OutputReturnType, apply_decorators, inputs, outputs, verb
from .types import Table


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


apply_decorators(
    [
        verb(name="workflow"),
        inputs(default_argument_name="table", named_input_argument="tables"),
        outputs(return_type=OutputReturnType.Table),
    ],
    workflow,
)
