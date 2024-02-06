import pandas as pd

from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.table_store import TableContainer
from datashaper.workflow.workflow import DEFAULT_INPUT_NAME, Workflow


@verb(name="workflow")
async def workflow(input: VerbInput, workflow: dict, workflow_instance: Workflow, input_arg: dict[str, str] | None = None):
    """Apply a sequence of operations to the input table."""
    # Set up the input tables for the subworkflow
    input_tables: dict[str, pd.DataFrame] = { DEFAULT_INPUT_NAME: input.get_input() }
    for source, dest in input_arg.items():
        input_tables[dest] = workflow_instance.output(source)

    # Create and run the subworkflow
    subworkflow = workflow_instance.derive(workflow, input_tables)
    await subworkflow.run()

    # Return the output table
    output = subworkflow.output()
    return TableContainer(table=output)