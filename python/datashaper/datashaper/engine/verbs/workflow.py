"""Contains the workflow verb definition."""

from typing import Any, cast

import pandas as pd

from datashaper.engine.create_verb_result import (
    create_verb_result,
)
from datashaper.engine.types import VerbResult
from datashaper.engine.verbs.verb_input import VerbInput
from datashaper.engine.verbs.verbs_mapping import verb
from datashaper.verbs import workflow as workflow_fn
from datashaper.workflow.workflow import Workflow


@verb(name="workflow")
async def workflow_verb(
    input: VerbInput, workflow: dict, workflow_instance: Workflow, **kwargs: Any
) -> VerbResult:
    """Apply a sequence of operations to the input table."""
    # Set up the input tables for the subworkflow
    result = await workflow_fn(
        cast(pd.DataFrame, input.get_input()), workflow, workflow_instance, **kwargs
    )
    return create_verb_result(result)
