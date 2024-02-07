import json
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Thread

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
    table = pd.read_csv(path)

    if "date" in table.columns:
        table["date"] = pd.to_datetime(table["date"], errors="coerce")
        table["newColumn"] = pd.to_datetime(table["newColumn"], errors="coerce")

    return table


def get_verb_test_specs(root: str) -> list[str]:
    subfolders: list[str] = []
    for data_dir, _, files in os.walk(root):
        if "workflow.json" in files:
            subfolders.append(data_dir)
    return subfolders


@pytest.mark.parametrize(
    "fixture_path",
    get_verb_test_specs(FIXTURES_PATH),
)
async def test_verbs_schema_input(fixture_path: str):
    with (Path(fixture_path) / "workflow.json").open() as schema:
        workflow = Workflow(
            schema=json.load(schema),
            input_path=TABLE_STORE_PATH,
            validate=True,
            schema_path=SCHEMA_PATH,
        )

    await workflow.run()
    for expected in os.listdir(fixture_path):
        if expected.endswith(".csv"):
            table_name = expected.split(".")[0]
            table_name_arg = table_name if table_name != "expected" else None
            result = workflow.output(table_name_arg)
            if isinstance(result, pd.DataFrame):
                result.to_csv(Path(fixture_path) / f"result_{expected}", index=False)
            else:
                result.obj.to_csv(
                    Path(fixture_path) / f"result_{expected}", index=False
                )
            assert_frame_equal(
                read_csv(Path(fixture_path) / expected),
                read_csv(Path(fixture_path) / f"result_{expected}"),
                check_like=True,
                check_dtype=False,
                check_column_type=False,
            )
            (Path(fixture_path) / f"result_{expected}").unlink()
