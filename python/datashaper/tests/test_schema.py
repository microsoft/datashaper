import json
import os

from http.client import HTTPConnection
from http.server import HTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from typing import List

import pandas as pd
import pytest

from pandas.testing import assert_frame_equal

from datashaper.graph import ExecutionGraph


FIXTURES_PATH = "fixtures/workflow"
TABLE_STORE_PATH = "fixtures/workflow_inputs"
SCHEMA_PATH = "workflow.json"

os.chdir("../../schema")

server = HTTPServer(("localhost", 8080), SimpleHTTPRequestHandler)
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()


def read_csv(path: str) -> pd.DataFrame:
    df = pd.read_csv(path, na_values=["undefined"])

    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")

    return df


def get_verb_test_specs(root: str) -> List[str]:
    subfolders: List[str] = []
    for root, _, files in os.walk(root):
        if "workflow.json" in files:
            subfolders.append(root)
    return subfolders


@pytest.mark.parametrize(
    "fixture_path",
    get_verb_test_specs(FIXTURES_PATH),
)
def test_verbs_schema_input(fixture_path: str):
    with open(os.path.join(fixture_path, "workflow.json")) as workflow:
        pipeline = ExecutionGraph(json.load(workflow), TABLE_STORE_PATH, SCHEMA_PATH)

    pipeline.run()
    for expected in os.listdir(fixture_path):
        if expected.endswith(".csv"):
            result = pipeline.get(expected.split(".")[0])
            if isinstance(result, pd.DataFrame):
                result.to_csv(
                    os.path.join(fixture_path, f"result_{expected}"), index=False
                )
            else:
                result.obj.to_csv(
                    os.path.join(fixture_path, f"result_{expected}"), index=False
                )
            assert_frame_equal(
                read_csv(os.path.join(fixture_path, expected)),
                read_csv(os.path.join(fixture_path, f"result_{expected}")),
                check_like=True,
                check_dtype=False,
                check_column_type=False,
            )
            os.remove(os.path.join(fixture_path, f"result_{expected}"))
