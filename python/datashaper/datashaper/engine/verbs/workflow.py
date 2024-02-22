"""Contains the workflow verb definition."""
from typing import cast

import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store.types import VerbResult, create_verb_result
from datashaper.workflow.workflow import DEFAULT_INPUT_NAME, Workflow


@verb(name="workflow")
async def workflow(
    input: VerbInput,
    workflow: dict,
    workflow_instance: Workflow,
    **_kwargs: dict,
) -> VerbResult:
    """Apply a sequence of operations to the input table."""
    # Set up the input tables for the subworkflow
    input_tables: dict[str, pd.DataFrame] = {
        DEFAULT_INPUT_NAME: cast(pd.DataFrame, input.get_input())
    }

    # Create and run the subworkflow
    subworkflow = workflow_instance.derive(workflow, input_tables)
    await subworkflow.run()

    # Return the output table
    output = subworkflow.output()
    return create_verb_result(output)
