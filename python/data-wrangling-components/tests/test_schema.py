import json
import os

from typing import List

import pandas as pd
import pytest

from pandas.testing import assert_frame_equal

from data_wrangling_components.pipeline import DefaultPipeline
from data_wrangling_components.table_store import DefaultTableStore, TableContainer


FIXTURES_PATH = "../../schema/fixtures/cases/verbs"
TABLE_STORE_PATH = "../../schema/fixtures/inputs"


def read_table_store(root: str) -> DefaultTableStore:
    table_store = DefaultTableStore()

    for table in os.listdir(root):
        table_name = table.split(".")[0]
        table_store.set(
            table_name,
            TableContainer(
                id=table_name,
                name=table_name,
                table=pd.read_csv(os.path.join(root, table)),
            ),
        )
    return table_store


def get_verb_test_specs(root: str) -> List[str]:
    subfolders: List[str] = []
    for root, _, files in os.walk(root):
        if "workflow.json" in files and "expected.csv" in files:
            subfolders.append(root)
    return subfolders


@pytest.mark.xfail
@pytest.mark.parametrize("fixture_path", get_verb_test_specs(FIXTURES_PATH))
def test_verbs_schema_input(fixture_path: str):
    with open(os.path.join(fixture_path, "workflow.json")) as workflow:
        pipeline = DefaultPipeline.from_json(
            steps=json.load(workflow)["steps"], store=read_table_store(TABLE_STORE_PATH)
        )

    result = pipeline.run()
    expected = pd.read_csv(os.path.join(fixture_path, "expected.csv"))

    assert_frame_equal(expected, result.table)
