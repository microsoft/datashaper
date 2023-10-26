import json
import os
from http.client import HTTPConnection
from http.server import HTTPServer, SimpleHTTPRequestHandler
from threading import Thread
from typing import List

import pandas as pd
import pytest
from pandas.testing import assert_frame_equal

from datashaper import Workflow

FIXTURES_PATH = "fixtures/workflow"
TABLE_STORE_PATH = "fixtures/workflow_inputs"
SCHEMA_PATH = "workflow.json"

os.chdir("../../schema")

server = HTTPServer(("localhost", 8080), SimpleHTTPRequestHandler)
thread = Thread(target=server.serve_forever, daemon=True)
thread.start()


def read_csv(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)

    if "date" in df.columns:
        df["date"] = pd.to_datetime(df["date"], errors="coerce")
        df["newColumn"] = pd.to_datetime(df["newColumn"], errors="coerce")

    return df


def get_verb_test_specs(root: str) -> List[str]:
    sub_folders: List[str] = []
    for root, _, files in os.walk(root):
        if "workflow.json" in files:
            sub_folders.append(root)
    return sub_folders


@pytest.mark.parametrize(
    "fixture_path",
    get_verb_test_specs(FIXTURES_PATH),
)
def test_verbs_schema_input(fixture_path: str):
    with open(os.path.join(fixture_path, "workflow.json")) as schema:
        workflow = Workflow(
            schema=json.load(schema),
            input_path=TABLE_STORE_PATH,
            validate=True,
            schema_path=SCHEMA_PATH,
        )

    workflow.run()
    for expected in os.listdir(fixture_path):
        if expected.endswith(".csv"):
            table_name = expected.split(".")[0]
            table_name_arg = table_name if table_name != "expected" else None
            result = workflow.output(table_name_arg)
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
