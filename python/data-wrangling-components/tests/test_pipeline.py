#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

import pandas as pd

from data_wrangling_components.pipeline import DefaultPipeline
from data_wrangling_components.types import MathOperator, Step, Verb


def test_run_pipeline_single_step():
    table = pd.DataFrame({"ID": [1, 2, 3, 4]})

    pipeline = DefaultPipeline()
    pipeline.add_dataset("input", table)

    pipeline.add(
        Step(
            verb=Verb.Fill,
            input="input",
            output="output",
            args={"to": "filled", "value": 1},
        )
    )

    result = pipeline.run()

    assert len(result.table.columns) == 2
    assert len(pipeline.list_store()) == 2


def test_run_multiple_steps():
    table = pd.DataFrame({"ID": [1, 2, 3, 4]})

    pipeline = DefaultPipeline()
    pipeline.add_dataset("input", table)

    pipeline.add_all(
        [
            Step(
                verb=Verb.Fill,
                input="input",
                output="output1",
                args={"to": "filled", "value": 1},
            ),
            Step(
                verb=Verb.Derive,
                input="output1",
                output="output2",
                args={
                    "to": "derived",
                    "column1": "ID",
                    "column2": "filled",
                    "operator": MathOperator.Add,
                },
            ),
        ]
    )

    result = pipeline.run()

    assert len(result.table.columns) == 3
    assert len(pipeline.list_store()) == 3
    assert result.table.loc[0, "derived"] == 2
